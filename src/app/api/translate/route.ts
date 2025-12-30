import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      );
    }

    // Check text length (limit to 5000 characters)
    if (text.trim().length > 5000) {
      return NextResponse.json(
        { error: '文本内容过长，请限制在5000字符以内' },
        { status: 400 }
      );
    }

    // Import ZAI SDK
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    // Create SDK instance
    const zai = await ZAI.create();

    // Detect if text is Chinese and translate to English, or translate to Chinese
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    const targetLanguage = hasChinese ? 'English' : '中文';

    // Use LLM for translation
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the given text from ${hasChinese ? 'Chinese to English' : 'the original language to Chinese'}. Maintain the original meaning, tone, and style. Only return the translated text, no explanations or additional content.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'gpt-4o-mini',
    });

    // Extract translation
    const translation = response.choices?.[0]?.message?.content || '';

    if (!translation || translation.trim().length === 0) {
      return NextResponse.json(
        { error: '翻译失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      translation: translation.trim(),
      targetLanguage,
      originalLength: text.length,
      translatedLength: translation.length
    });
  } catch (error) {
    console.error('Translation API Error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '翻译失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
