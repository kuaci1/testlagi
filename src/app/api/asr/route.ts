import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    // Validate audio file
    if (!audioFile) {
      return NextResponse.json(
        { error: '音频文件不能为空' },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: '音频文件过大，最大支持100MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/x-m4a', 'audio/flac', 'audio/ogg', 'audio/webm'];
    if (!validTypes.includes(audioFile.type) && !audioFile.name.match(/\.(wav|mp3|m4a|flac|ogg|webm)$/i)) {
      return NextResponse.json(
        { error: '不支持的音频格式，请使用 WAV、MP3、M4A、FLAC 或 OGG 格式' },
        { status: 400 }
      );
    }

    // Convert audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const base64Audio = buffer.toString('base64');

    // Import ZAI SDK
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    // Create SDK instance
    const zai = await ZAI.create();

    // Transcribe audio
    const response = await zai.audio.asr.create({
      file_base64: base64Audio
    });

    const transcription = response.text;

    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json(
        { error: '未能识别音频内容，请检查音频质量' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transcription: transcription,
      wordCount: transcription.split(/\s+/).length,
      characterCount: transcription.length,
      audioSize: audioFile.size,
      audioType: audioFile.type
    });
  } catch (error) {
    console.error('ASR API Error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '语音识别失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
