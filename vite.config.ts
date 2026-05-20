import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      base: isProduction ? '/ClipForge-AI/' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss(), cloudflare()],
      
      // =============================================
      // Production Build Hardening
      // =============================================
      build: {
        // No source maps in production - prevents reverse engineering
        sourcemap: isProduction ? false : true,
        
        // Aggressive minification settings
        minify: 'esbuild',
        
        // Rollup options for extra obfuscation
        rollupOptions: {
          output: {
            // Obfuscate chunk file names (hashes instead of readable names)
            chunkFileNames: 'assets/[hash].js',
            entryFileNames: 'assets/[hash].js',
            assetFileNames: 'assets/[hash][extname]',
            
            // Manual chunk splitting
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                // Keep all vendor code in a single chunk to avoid circular deps
                return 'vendor';
              }
            },
          },
        },
        
        // ESBuild-specific hardening
        esbuild: {
          // Drop console.log and debugger statements in production
          // This prevents info leaks via browser console
          ...(isProduction && {
            drop: ['console', 'debugger'],
          }),
          // Remove all comments from output
          legalComments: 'none',
        },
        
        // Ensure build output is clean and secure
        cssMinify: true,
        cssCodeSplit: false,
        
        // Warn about large chunks that could be analyzed
        chunkSizeWarningLimit: 1000,
      },
      
      define: {
        // Build-time substitutions - values are inlined at build time
        // Environment variables matching these patterns won't appear as strings in the bundle
        '__APP_VERSION__': JSON.stringify(env.npm_package_version || '0.0.0'),
        '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
        // Clear these so they don't leak into client bundle
        'process.env.API_KEY': 'undefined',
        'process.env.GEMINI_API_KEY': 'undefined',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
    };
});