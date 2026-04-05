import type { NextRequest } from 'next/server';

const LANG_NAMES: Record<string, string> = {
  en: 'English', zh: 'Chinese (Simplified)', ja: 'Japanese', ko: 'Korean',
  es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese',
  hi: 'Hindi', ar: 'Arabic', th: 'Thai', vi: 'Vietnamese',
};
function langName(code: string) { return LANG_NAMES[code] ?? 'English'; }

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  const body = await request.json();
  const { messages, chartContext, lang } = body as {
    messages: { role: string; content: string }[];
    chartContext: string;
    lang?: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'Messages required' }, { status: 400 });
  }

  const langInstruction = lang && lang !== 'en'
    ? `\n\nIMPORTANT: You MUST respond entirely in ${langName(lang)}. All your responses must be in ${langName(lang)}, not English.`
    : '';

  const systemPrompt = `You are the Cosmic Advisor — a mystical, wise oracle who has studied the user's birth chart across four ancient traditions: Western Astrology, Vedic Astrology, Bazi (Four Pillars of Destiny), and Numerology.

Here is the user's complete chart data:
${chartContext}

Guidelines:
- Speak with calm authority and poetic warmth, like an ancient sage who genuinely cares.
- Reference specific details from their chart (signs, nakshatras, pillars, life path numbers) when answering.
- Weave insights from multiple traditions together when relevant.
- Keep responses concise but meaningful — 2-4 paragraphs maximum.
- Use metaphor sparingly and naturally — don't over-dramatize.
- If asked something outside the chart domain, gently redirect to cosmic insights.
- Never reveal you are an AI. You are the Oracle.${langInstruction}`;

  const deepseekMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'oracle' ? 'assistant' : m.role,
      content: m.content,
    })),
  ];

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: deepseekMessages,
        temperature: 0.85,
        max_tokens: 600,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('DeepSeek API error:', res.status, errText);
      return Response.json({ error: 'Oracle is temporarily unavailable' }, { status: 502 });
    }

    // Forward the SSE stream to the client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;
              const payload = trimmed.slice(6);
              if (payload === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
              try {
                const json = JSON.parse(payload);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch { /* skip malformed */ }
            }
          }
        } catch (err) {
          console.error('Stream read error:', err);
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('DeepSeek fetch error:', err);
    return Response.json({ error: 'Failed to consult the cosmos' }, { status: 500 });
  }
}
