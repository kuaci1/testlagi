import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'tongtong', speed = 1.0 } = await req.json();

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      );
    }

    if (text.trim().length > 10000) {
      return NextResponse.json(
        { error: '文本内容过长，请限制在10000字符以内' },
        { status: 400 }
      );
    }

    // Validate speed
    if (speed < 0.5 || speed > 2.0) {
      return NextResponse.json(
        { error: '语速必须在0.5到2.0之间' },
        { status: 400 }
      );
    }

    // Validate voice
    const validVoices = ['tongtong', 'chuichui', 'xiaochen', 'jam', 'kazi', 'douji', 'luodo'];
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: '无效的语音类型' },
        { status: 400 }
      );
    }

    // Import ZAI SDK
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    // Create SDK instance
    const zai = await ZAI.create();

    // Generate TTS audio
    const response = await zai.audio.tts.create({
      input: text.trim(),
      voice: voice,
      speed: speed,
      response_format: 'wav',
      stream: false,
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    // Return audio as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
        'Content-Disposition': `attachment; filename="podcast-${Date.now()}.wav"`,
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '生成语音失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
