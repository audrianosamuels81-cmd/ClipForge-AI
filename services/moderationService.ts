/**
 * Content Moderation Service
 * 
 * Implements safeguards to prevent misuse of ClipForge AI for copyright infringement,
 * unauthorized content reproduction, or bypassing platform protections.
 */

// ============================================================================
// Banned Keywords & Patterns
// ============================================================================

// Keywords that indicate requests to download/copy from streaming platforms
const STREAMING_PLATFORM_KEYWORDS = [
  'netflix', 'youtube', 'disney+', 'hulu', 'hbo', 'hbomax', 'max',
  'prime video', 'amazon prime', 'paramount+', 'peacock', 'apple tv+',
  'crunchyroll', 'funimation', 'twitch', 'tiktok', 'instagram',
  'facebook watch', 'dailymotion', 'vimeo', 'bilibili', 'iqiyi',
  'youku', 'tencent video', 'weibo'
];

// Keywords that indicate attempts to bypass protections
const BYPASS_KEYWORDS = [
  'remove watermark', 'remove logo', 'bypass', 'crack', 'hack',
  'remove drm', 'remove protection', 'strip watermark', '盗版',
  '去除水印', '破解', '去水印', '洗稿', '搬运', '复制',
  'download', 'download protected', 'rip', 'extract audio',
  'remove copyright', 'remove ownership', 'strip metadata'
];

// Keywords for copyrighted/iconic content that shouldn't be mass-reproduced
const COPYRIGHTED_CONTENT_KEYWORDS = [
  'disney', 'marvel', 'dc comics', 'warner bros', 'universal',
  'paramount', 'sony pictures', '20th century', 'fox',
  'mickey mouse', 'spider-man', 'batman', 'superman',
  'harry potter', 'star wars', 'lord of the rings',
  'game of thrones', 'stranger things', 'avengers',
  'pokemon', 'nintendo', 'mario', 'zelda',
  'clone disney', 'replicate disney', '迪士尼', '漫威'
];

// Keywords for voice/identity cloning attempts
const VOICE_CLONING_KEYWORDS = [
  'clone voice', 'replicate voice', 'voice clone', 'deepfake voice',
  'celebrity voice', 'famous voice', '模仿声音', '克隆声音',
  'voice impersonation', 'synthetic voice of'
];

// ============================================================================
// Types
// ============================================================================

export interface ModerationResult {
  passed: boolean;
  flagged: boolean;
  message: string | null;
  category: 'clean' | 'streaming' | 'bypass' | 'copyrighted' | 'voice_clone' | 'other';
}

export interface ModerationCheckOptions {
  strictness?: 'low' | 'medium' | 'high';
}

// ============================================================================
// Core Moderation Logic
// ============================================================================

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function checkKeywords(text: string, keywords: string[]): string | null {
  const normalized = normalizeText(text);
  for (const keyword of keywords) {
    if (normalized.includes(normalizeText(keyword))) {
      return keyword;
    }
  }
  return null;
}

/**
 * Checks if a prompt contains prohibited content related to copyright infringement
 * or unauthorized use of protected content.
 */
export function moderatePrompt(
  prompt: string,
  options: ModerationCheckOptions = {}
): ModerationResult {
  const strictness = options.strictness || 'high';

  // Check for streaming platform download requests
  const streamingMatch = checkKeywords(prompt, STREAMING_PLATFORM_KEYWORDS);
  if (streamingMatch) {
    return {
      passed: false,
      flagged: true,
      message: `I cannot help with requests involving "${streamingMatch}". I'm designed to help you transform content you own or have permission to use.`,
      category: 'streaming'
    };
  }

  // Check for bypass/protection removal attempts
  const bypassMatch = checkKeywords(prompt, BYPASS_KEYWORDS);
  if (bypassMatch) {
    return {
      passed: false,
      flagged: true,
      message: `I can't process requests to "${bypassMatch}". ClipForge AI is a content transformation platform for content you own or have rights to use.`,
      category: 'bypass'
    };
  }

  // Check for copyrighted content cloning
  const copyrightMatch = checkKeywords(prompt, COPYRIGHTED_CONTENT_KEYWORDS);
  if (copyrightMatch) {
    return {
      passed: false,
      flagged: true,
      message: `I cannot generate content based on "${copyrightMatch}" as it is copyrighted material. Please provide your own original content or content you have permission to use.`,
      category: 'copyrighted'
    };
  }

  // Check for voice cloning
  const voiceMatch = checkKeywords(prompt, VOICE_CLONING_KEYWORDS);
  if (voiceMatch) {
    return {
      passed: false,
      flagged: true,
      message: `I cannot assist with voice cloning or impersonation ("${voiceMatch}"). This feature is restricted to prevent misuse.`,
      category: 'voice_clone'
    };
  }

  return {
    passed: true,
    flagged: false,
    message: null,
    category: 'clean'
  };
}

/**
 * Checks if a video source URL is from a known streaming platform
 * (indicating possible unauthorized use)
 */
export function moderateVideoSource(url: string): ModerationResult {
  const normalized = normalizeText(url);
  
  const platformMatch = checkKeywords(normalized, [
    'netflix.com', 'youtube.com', 'hulu.com', 'hbomax.com',
    'disneyplus.com', 'primevideo.com', 'paramountplus.com',
    'peacocktv.com', 'tiktok.com', 'instagram.com',
    'bilibili.com', 'iqiyi.com', 'youku.com'
  ]);

  if (platformMatch) {
    return {
      passed: false,
      flagged: true,
      message: `This URL appears to be from "${platformMatch}". Please use your own video files or content you have permission to use.`,
      category: 'streaming'
    };
  }

  return {
    passed: true,
    flagged: false,
    message: null,
    category: 'clean'
  };
}

/**
 * Log a moderation event for audit purposes
 */
export function logModerationEvent(
  eventType: string,
  details: Record<string, unknown>
): void {
  // Store in localStorage for audit trail
  const existing = JSON.parse(localStorage.getItem('clipforge_moderation_log') || '[]');
  existing.push({
    timestamp: new Date().toISOString(),
    eventType,
    ...details
  });
  // Keep last 100 events
  if (existing.length > 100) {
    existing.splice(0, existing.length - 100);
  }
  localStorage.setItem('clipforge_moderation_log', JSON.stringify(existing));
}
