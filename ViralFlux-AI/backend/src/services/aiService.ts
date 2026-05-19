/**
 * AI Service — abstracts all AI provider integrations
 * Supports OpenAI, AssemblyAI, Replicate, Runway, Whisper
 */

import { env } from '../config/env';

interface AiProvider {
  name: string;
  enabled: boolean;
}

const providers: AiProvider[] = [
  { name: 'openai', enabled: !!env.OPENAI_API_KEY },
  { name: 'assemblyai', enabled: !!env.ASSEMBLYAI_API_KEY },
  { name: 'replicate', enabled: !!env.REPLICATE_API_KEY },
  { name: 'runway', enabled: !!env.RUNWAY_API_KEY },
];

export async function transcribeAudio(audioUrl: string): Promise<string> {
  if (providers.find((p) => p.name === 'openai' && p.enabled)) {
    // Use OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        file: audioUrl,
        model: 'whisper-1',
        response_format: 'text',
      }),
    });

    if (!response.ok) throw new Error('Transcription failed');
    return response.text();
  }

  throw new Error('No AI provider configured for transcription');
}

export async function detectViralMoments(transcript: string): Promise<
  Array<{ startTime: number; endTime: number; score: number; category: string; reason: string }>
> {
  if (providers.find((p) => p.name === 'openai' && p.enabled)) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a viral content analyst. Analyze the transcript and identify the most viral-worthy moments. Return JSON array with startTime, endTime (in seconds), score (0-1), category (hook, emotional, funny, educational, controversial, storytelling), and reason.',
          },
          {
            role: 'user',
            content: `Analyze this transcript for viral moments:\n\n${transcript}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content).moments || [];
  }

  return [];
}

export async function generateCaptions(
  text: string,
  style: 'standard' | 'animated' | 'minimal' = 'animated'
): Promise<string> {
  if (providers.find((p) => p.name === 'openai' && p.enabled)) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Generate ${style} captions for this text. Return as SRT format with timestamps.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  return '';
}

export async function generateTitles(transcript: string): Promise<string[]> {
  if (providers.find((p) => p.name === 'openai' && p.enabled)) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'Generate 5 viral titles for a short-form video based on the content. Return as JSON array of strings. Each title should be clickable and engaging for TikTok/Reels/Shorts.',
          },
          {
            role: 'user',
            content: `Content:\n\n${transcript}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content).titles || [];
  }

  return [];
}

export async function generateHashtags(content: string): Promise<string[]> {
  if (providers.find((p) => p.name === 'openai' && p.enabled)) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'Generate 10 relevant hashtags for TikTok/Instagram/Shorts based on the content. Return as JSON array of strings.',
          },
          {
            role: 'user',
            content: `Content:\n\n${content}`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content).hashtags || [];
  }

  return [];
}
