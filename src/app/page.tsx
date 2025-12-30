'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Play,
  Pause,
  Download,
  Volume2,
  Sparkles,
  Loader2,
  Download as DownloadIcon,
  Mic,
  MicOff,
  Square,
  Copy,
  Languages,
  Check,
  FileText,
  Clock,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

// Theme configuration
interface Theme {
  name: string
  id: string
  background: string
  backgroundSecondary: string
  foreground: string
  foregroundSecondary: string
  accent: string
  card: string
  cardHover: string
  border: string
  text: string
  textSecondary: string
  input: string
  inputHover: string
  icon: string
}

const THEMES: Record<string, Theme> = {
  cream: {
    name: 'Cream',
    id: 'cream',
    background: '#faf8f5',
    backgroundSecondary: '#f5f3f0',
    foreground: '#8b7355',
    foregroundSecondary: '#6b5344',
    accent: '#8b7355',
    card: 'rgba(255, 255, 255, 0.7)',
    cardHover: 'rgba(255, 255, 255, 0.85)',
    border: '#e8e6e3',
    text: '#4a4a4a',
    textSecondary: '#6b6b6b',
    input: 'rgba(250, 248, 245, 0.5)',
    inputHover: 'rgba(250, 248, 245, 0.7)',
    icon: '#1a1a1a',
  },
  charcoal: {
    name: 'Charcoal',
    id: 'charcoal',
    background: '#2a2a2a',
    backgroundSecondary: '#3a3a3a',
    foreground: '#d4af37',
    foregroundSecondary: '#b5952f',
    accent: '#d4af37',
    card: 'rgba(60, 60, 60, 0.7)',
    cardHover: 'rgba(70, 70, 70, 0.85)',
    border: '#4a4a4a',
    text: '#e8e8e8',
    textSecondary: '#c8c8c8',
    input: 'rgba(60, 60, 60, 0.5)',
    inputHover: 'rgba(70, 70, 70, 0.7)',
    icon: '#e8e8e8',
  },
  powder: {
    name: 'Powder Blusher',
    id: 'powder',
    background: '#fff0f0',
    backgroundSecondary: '#ffe8e8',
    foreground: '#c9a0a0',
    foregroundSecondary: '#a98080',
    accent: '#c9a0a0',
    card: 'rgba(255, 255, 255, 0.7)',
    cardHover: 'rgba(255, 255, 255, 0.85)',
    border: '#f0d0d0',
    text: '#5a4a4a',
    textSecondary: '#7a6a6a',
    input: 'rgba(255, 240, 240, 0.5)',
    inputHover: 'rgba(255, 240, 240, 0.7)',
    icon: '#5a4a4a',
  },
}

// Podcast Templates
interface PodcastTemplate {
  id: string
  title: string
  category: string
  icon: any
  description: string
  content: string
  characterCount: number
  estimatedDuration: string
}

const PODCAST_TEMPLATES: PodcastTemplate[] = [
  {
    id: 'technology',
    title: 'AI Revolution',
    category: 'Technology',
    icon: Zap,
    description: 'Explore how artificial intelligence is transforming our daily lives',
    content: `Welcome to "AI Revolution," the podcast where we decode the future of technology and its impact on humanity.

I'm your host, and today we're diving deep into one of the most transformative technologies of our time: Artificial Intelligence.

From the algorithms that power our social media feeds to the autonomous vehicles navigating our streets, AI has become an invisible but integral part of modern life. But what does this mean for us as individuals and as a society?

In this episode, we'll explore:

First, the practical applications: How AI is revolutionizing healthcare through early disease detection and personalized treatment plans. We'll hear from leading researchers about breakthroughs that were once the stuff of science fiction.

Second, the economic landscape: The shift in job markets, new career opportunities emerging, and how we can prepare for the AI-driven future. We'll discuss the importance of continuous learning and adaptability.

Third, the ethical considerations: Privacy concerns, algorithmic bias, and the critical question of how we ensure AI benefits everyone, not just a privileged few.

But this isn't just about technology—it's about people. We'll share inspiring stories of entrepreneurs using AI to solve real-world problems, artists collaborating with AI to create groundbreaking works, and communities leveraging these tools for positive change.

The AI revolution isn't coming—it's here. And the question isn't whether we'll adapt, but how we'll shape this revolution to reflect our values and aspirations.

So join us as we navigate this exciting frontier, one episode at a time. The future is being written today, and you're part of the story.

This is "AI Revolution"—where technology meets humanity.`,
    characterCount: 1847,
    estimatedDuration: '7:30',
  },
  {
    id: 'wellness',
    title: 'Mindful Morning',
    category: 'Wellness',
    icon: Sparkles,
    description: 'Start your day with intention, gratitude, and positive energy',
    content: `Good morning, and welcome to "Mindful Morning"—your daily companion for starting each day with purpose, peace, and positivity.

I'm so glad you're here. In a world that often feels rushed and overwhelming, taking just a few moments each morning to center yourself can transform your entire day.

Let's begin with a simple breathing exercise. Find a comfortable position, close your eyes, and take a deep breath in for four counts. Hold it for four counts. Now release it slowly for eight counts. Let's do this together three more times.

With each breath, feel the tension leaving your body. With each exhale, release the worries of yesterday and the anxieties about tomorrow. Right here, right now, in this moment—you are safe. You are enough. You are worthy.

Now, let's practice gratitude. Think of three things you're grateful for today. They don't have to be big things. Maybe it's the warmth of your morning coffee, the sound of birds outside your window, or simply the fact that you woke up to see another beautiful day.

Gratitude isn't just about feeling good—it's about shifting our perspective. When we focus on what we have rather than what we lack, we open ourselves to abundance and joy.

Today, I want you to set one intention. Not a goal or a to-do list item, but a feeling or quality you want to embody today. Maybe it's patience, kindness, courage, or simply presence. Hold this intention in your heart as you move through your day.

Remember, mindful mornings aren't about perfection. They're about presence. Some days will be easier than others, and that's okay. What matters is showing up for yourself, day after day, with compassion and curiosity.

Before we close, I want you to carry one thought with you: You have everything you need within you to handle whatever today brings. Trust yourself. Be kind to yourself. And remember, every morning is a new beginning.

Thank you for starting your day with me. I'll see you tomorrow for another mindful morning.

Until then, be well, be kind, and be present.`,
    characterCount: 2158,
    estimatedDuration: '8:40',
  },
  {
    id: 'business',
    title: 'Entrepreneur\'s Journey',
    category: 'Business',
    icon: FileText,
    description: 'Inspiring stories and practical advice for aspiring entrepreneurs',
    content: `Welcome to "Entrepreneur's Journey," the podcast that celebrates the bold dreamers, risk-takers, and innovators building the businesses of tomorrow.

I'm your host, and today we're tackling a topic that every entrepreneur faces at some point: the leap from idea to action.

You know the feeling—that spark of inspiration that keeps you up at night. That vision of a product or service that could change lives, disrupt industries, or simply make the world a little bit better. It's exciting, it's terrifying, and it's absolutely necessary.

Because here's the truth about entrepreneurship: ideas are cheap. Execution is everything.

Today, we're going to break down the journey into actionable steps. Not the romanticized version you see in movies, but the real, gritty work of building something from nothing.

Step one: Validate your idea. Before you invest time, money, and heart into your vision, you need proof that people actually want it. Talk to potential customers. Create a minimum viable product. Test, learn, iterate. The market will teach you more than any business school ever could.

Step two: Build your team. You cannot do this alone. Surround yourself with people who complement your skills, challenge your assumptions, and share your vision. But remember—the most important team member you'll ever hire is yourself. Invest in your growth, your health, and your resilience.

Step three: Embrace failure. Not as possibility, but as probability. You will fail. You will make mistakes. You will have days where you want to quit. The entrepreneurs who succeed aren't the ones who never fail—they're the ones who never give up.

Throughout this podcast series, you'll hear stories of founders who faced bankruptcy, rejection, and seemingly insurmountable odds. You'll learn about their darkest moments and their greatest triumphs. And most importantly, you'll discover that their journey is not so different from yours.

Because entrepreneurship isn't just about building a business—it's about building yourself. The courage, resilience, and wisdom you develop along the way will serve you for the rest of your life, whether your company succeeds or fails.

So take that leap. Start today. Start small. But start.

This is "Entrepreneur's Journey"—where we turn dreams into reality, one step at a time.

Let's build something extraordinary together.`,
    characterCount: 2280,
    estimatedDuration: '9:10',
  },
  {
    id: 'storytelling',
    title: 'Tales From Tomorrow',
    category: 'Storytelling',
    icon: Zap,
    description: 'Immersive science fiction narratives exploring future worlds',
    content: `Welcome to "Tales From Tomorrow," where imagination knows no bounds and the future unfolds one story at a time.

Tonight's tale begins on Mars, in the year 2187...

The red dust of Mars has always been unforgiving, but today it seems particularly restless. Commander Elena Reyes stands at the observation deck of the Ares Colony, watching the endless storm swirl outside the reinforced glass. Thirty years she's spent on this planet—longer than she ever lived on Earth.

"Commander," the AI's voice breaks through her thoughts. "We've received a transmission from Sector 7. It's the research team at Olympus Mons. They've found something."

Elena's heart quickens. The Olympus Mons research team has been silent for three months, lost in one of the fiercest dust storms in Martian history. Their disappearance has weighed heavily on her conscience.

"What did they say?"

"It's not a message, Commander. It's a signal. And it's not human."

The implications send a chill down Elena's spine. For decades, humanity has searched for signs of life beyond Earth. Probes sent to every corner of the solar system. Radio telescopes listening to the stars. All met with silence. Until now.

"Prepare a rover," she orders, her voice steady despite the racing thoughts in her mind. "I'm leading the expedition myself."

The journey to Olympus Mons takes two days through the storm. Elena drives the rover with practiced precision, her mind racing with possibilities. First contact with alien intelligence? The discovery that humanity is not alone? It's everything humanity has dreamed of for generations.

When they finally arrive at the research station, it's eerily quiet. The automated systems are still running—lights flicker, air recyclers hum—but there's no sign of the research team.

Then she sees it. In the center of the main laboratory, something is pulsing with an otherworldly glow. Not machine, not biological—something in between. Something that shouldn't exist, yet undeniably does.

As Elena approaches, the object responds. The glow intensifies, patterns of light and energy swirling around it. And then, in her mind, she hears something. Not a voice, but a presence. An intelligence that has been waiting. Watching. Understanding.

"Human," it seems to say, the communication bypassing language entirely. "We have been waiting for you to evolve enough to understand. Your species has reached a critical threshold. The choice before you will determine your fate, and the fate of all life in this galaxy."

Elena realizes with sudden clarity that this isn't just first contact. This is a test. And humanity has been taking it for millennia without even knowing.

The story continues... next time on "Tales From Tomorrow."

I'm your host, and remember: the future isn't just something that happens to us—it's something we create together.

Until next time, keep looking up, keep dreaming, and never stop wondering what tomorrow might bring.`,
    characterCount: 2567,
    estimatedDuration: '10:15',
  },
  {
    id: 'education',
    title: 'Knowledge Lab',
    category: 'Education',
    icon: Clock,
    description: 'Deep dive into fascinating topics from science, history, and culture',
    content: `Welcome to "Knowledge Lab," where we satisfy our curiosity and explore the fascinating ideas that shape our world.

I'm your host, and today we're going to talk about something that's both incredibly simple and profoundly complex: the concept of time.

Think about it for a moment. What is time? It seems so fundamental to our experience of reality. We measure it in seconds, hours, days, years. We plan our lives around it. We never seem to have enough of it. But can any of us truly say what it actually is?

For most of human history, time was thought to be absolute—a constant backdrop against which the drama of the universe played out. Then came Einstein, who shattered that understanding with his theory of relativity. According to Einstein, time is relative. It can stretch and compress depending on your speed and the strength of gravity around you.

Here's a mind-bending fact: time passes differently for a person standing on Earth's surface compared to someone orbiting in the International Space Station. The difference is tiny, but it's real. Astronauts return from space having aged slightly less than people who stayed on Earth.

But it gets even stranger. At the quantum level, time seems to behave differently than in our everyday experience. Some physicists argue that time itself might not be fundamental—that it emerges from more basic interactions in the fabric of reality.

So what does this mean for us in our daily lives?

First, it reminds us that our experience of time is subjective. Think about how time seems to fly when you're engaged in something you love, yet drags endlessly when you're bored or anxious. That's not just psychological—your brain is literally processing time differently.

Second, it teaches us to value the present moment. The past is memory, the future is imagination. The only time that truly exists is now. Every moment you're given is irreplaceable.

Third, it encourages us to think differently about how we spend our time. We often talk about "killing time" or "saving time," but these metaphors miss the point. Time isn't a resource we can manage like money or material goods. It's the medium in which our lives unfold.

Throughout human history, different cultures have understood time in different ways. Some saw it as cyclical—endless repetition of seasons and patterns. Others saw it as linear—a progression from past through present to future. Modern science suggests both perspectives might contain truth.

The ancient Greeks had two words for time: chronos, which refers to sequential time, and kairos, which refers to the right or opportune moment. They understood that not all moments are equal. Some moments are transformational—points of no return that change the trajectory of our lives.

So here's my invitation to you: pay attention to those kairos moments. Be present for them. Don't let them slip by unnoticed because you're distracted by the past or worried about the future.

Because in the end, how we spend our days is how we spend our lives. And time, once gone, never returns.

This is "Knowledge Lab"—where every question leads to another, and the journey of learning never ends.

Thank you for joining me today. Stay curious.`,
    characterCount: 2698,
    estimatedDuration: '10:50',
  },
]

interface AudioState {
  audioUrl: string | null
  isPlaying: boolean
  duration: number
  currentTime: number
}

interface ASRState {
  isRecording: boolean
  recordedUrl: string | null
  recordingTime: number
  transcription: string
  translatedText: string
  isTranscribing: boolean
  isTranslating: boolean
  selectedLanguage: string
}

const VOICE_OPTIONS = [
  { value: 'tongtong', label: 'Tongtong - 温暖亲切' },
  { value: 'chuichui', label: 'Chuichui - 活泼可爱' },
  { value: 'xiaochen', label: 'Xiaochen - 沉稳专业' },
  { value: 'jam', label: 'Jam - 英音绅士' },
  { value: 'kazi', label: 'Kazi - 清晰标准' },
  { value: 'douji', label: 'Douji - 自然流畅' },
  { value: 'luodo', label: 'Luodo - 富有感染力' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
]

export default function PodcastGenerator() {
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.cream)

  // TTS State
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('tongtong')
  const [speed, setSpeed] = useState([1.0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [audio, setAudio] = useState<AudioState>({
    audioUrl: null,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
  })

  // ASR State
  const [asr, setAsr] = useState<ASRState>({
    isRecording: false,
    recordedUrl: null,
    recordingTime: 0,
    transcription: '',
    translatedText: '',
    isTranscribing: false,
    isTranslating: false,
    selectedLanguage: 'en',
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // TTS Functions
  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('请输入要转换的文本内容')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          speed: speed[0],
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '生成音频失败')
      }

      const blob = await response.blob()
      const audioUrl = URL.createObjectURL(blob)

      setAudio({
        audioUrl,
        isPlaying: false,
        duration: 0,
        currentTime: 0,
      })

      toast.success('播客生成成功！')
    } catch (error) {
      console.error('Error generating audio:', error)
      toast.error(error instanceof Error ? error.message : '生成音频失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (audio.isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setAudio(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return

    setAudio(prev => ({
      ...prev,
      currentTime: audioRef.current?.currentTime || 0,
      duration: audioRef.current?.duration || 0,
    }))
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = value[0]
    setAudio(prev => ({ ...prev, currentTime: value[0] }))
  }

  const handleDownload = () => {
    if (!audio.audioUrl) return

    const a = document.createElement('a')
    a.href = audio.audioUrl
    a.download = `podcast-${Date.now()}.wav`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast.success('播客已下载')
  }

  const handleAudioEnded = () => {
    setAudio(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getCharacterCount = () => {
    return text.length
  }

  const getEstimatedDuration = () => {
    if (!text.trim()) return '0:00'
    const wordCount = text.trim().split(/\s+/).length
    const estimatedSeconds = Math.ceil(wordCount / speed[0] * 2)
    const minutes = Math.floor(estimatedSeconds / 60)
    const seconds = estimatedSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleUseTemplate = (template: PodcastTemplate) => {
    setText(template.content)
    toast.success(`Template "${template.title}" loaded!`)
  }

  // ASR Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Setup AudioContext for visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      const bufferLength = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLength)

      // Start visualization
      if (canvasRef.current) {
        visualize()
      }

      // Setup MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      recordingChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAsr(prev => ({ ...prev, recordedUrl: url, isRecording: false }))

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())

        // Cleanup AudioContext
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }

        // Stop visualization
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }

      mediaRecorderRef.current.start()

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setAsr(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }))
      }, 1000)

      setAsr(prev => ({ ...prev, isRecording: true, recordingTime: 0 }))
      toast.success('开始录音')
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('无法访问麦克风，请检查权限设置')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }

    toast.success('录音完成')
  }

  const handleTranscribe = async () => {
    if (!asr.recordedUrl) {
      toast.error('请先录制音频')
      return
    }

    setAsr(prev => ({ ...prev, isTranscribing: true }))
    try {
      const response = await fetch(asr.recordedUrl)
      const blob = await response.blob()
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')

      const apiResponse = await fetch('/api/asr', {
        method: 'POST',
        body: formData,
      })

      if (!apiResponse.ok) {
        const error = await apiResponse.json()
        throw new Error(error.error || '语音识别失败')
      }

      const result = await apiResponse.json()
      setAsr(prev => ({ ...prev, transcription: result.transcription }))
      toast.success(`识别成功！共 ${result.wordCount} 个词`)
    } catch (error) {
      console.error('Error transcribing audio:', error)
      toast.error(error instanceof Error ? error.message : '语音识别失败，请稍后重试')
    } finally {
      setAsr(prev => ({ ...prev, isTranscribing: false }))
    }
  }

  const handleTranslate = async () => {
    if (!asr.transcription.trim()) {
      toast.error('请先进行语音识别')
      return
    }

    setAsr(prev => ({ ...prev, isTranslating: true }))
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: asr.transcription,
          targetLanguage: asr.selectedLanguage,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '翻译失败')
      }

      const result = await response.json()
      setAsr(prev => ({ ...prev, translatedText: result.translation }))
      toast.success('翻译成功！')
    } catch (error) {
      console.error('Error translating text:', error)
      toast.error(error instanceof Error ? error.message : '翻译失败，请稍后重试')
    } finally {
      setAsr(prev => ({ ...prev, isTranslating: false }))
    }
  }

  const handleCopyToTTS = (textToCopy: string) => {
    if (!textToCopy.trim()) {
      toast.error('没有可复制的文本')
      return
    }
    setText(textToCopy)
    toast.success('已复制到播客生成器')
  }

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
    toast.success('已复制到剪贴板')
  }

  // Audio visualization
  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      const bgFill = currentTheme.id === 'cream'
        ? 'rgba(250, 248, 245, 0.95)'
        : currentTheme.id === 'charcoal'
          ? 'rgba(60, 60, 60, 0.95)'
          : 'rgba(255, 240, 240, 0.95)'

      const gradientStart = currentTheme.id === 'cream'
        ? 'rgba(139, 115, 85, 0.8)'
        : currentTheme.id === 'charcoal'
          ? 'rgba(212, 175, 55, 0.8)'
          : 'rgba(201, 160, 160, 0.8)'

      const gradientEnd = currentTheme.id === 'cream'
        ? 'rgba(139, 115, 85, 0.6)'
        : currentTheme.id === 'charcoal'
          ? 'rgba(212, 175, 55, 0.6)'
          : 'rgba(201, 160, 160, 0.6)'

      ctx.fillStyle = bgFill
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / dataArray.length) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < dataArray.length; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight)
        gradient.addColorStop(0, gradientStart)
        gradient.addColorStop(1, gradientEnd)

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: currentTheme.background }}
    >
      {/* Subtle fabric texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, ${currentTheme.text}10 1px, transparent 0)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Navigation Bar with Theme Selector */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-500"
        style={{
          backgroundColor: `${currentTheme.card}80`,
          borderColor: currentTheme.border,
        }}
      >
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <Volume2
              className="w-5 h-5 transition-colors duration-300"
              style={{ color: currentTheme.foreground }}
            />
            <span
              className="font-medium text-sm tracking-tight transition-colors duration-300"
              style={{ color: currentTheme.text }}
            >
              Podcast Generator
            </span>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setCurrentTheme(theme)}
                className="relative group"
                title={theme.name}
              >
                {/* Outer ring for selected state */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    currentTheme.id === theme.id
                      ? 'scale-125 opacity-100'
                      : 'scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-30'
                  }`}
                  style={{ backgroundColor: theme.background }}
                />

                {/* Color block */}
                <div
                  className={`relative w-8 h-8 rounded-full transition-all duration-300 shadow-sm ${
                    currentTheme.id === theme.id
                      ? 'scale-110 ring-2'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: theme.background,
                    ringColor: currentTheme.id === theme.id ? theme.foreground : 'transparent',
                  }}
                >
                  {/* Foreground accent dot */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: theme.foreground,
                      opacity: currentTheme.id === theme.id ? 1 : 0.6,
                    }}
                  />
                </div>

                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded shadow-lg pointer-events-none"
                  style={{
                    backgroundColor: currentTheme.card,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`,
                  }}
                >
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14">
          {/* High-end lined headline */}
          <div className="relative inline-block mb-5">
            <div
              className="absolute top-1/2 left-0 w-16 h-px transform -translate-y-1/2 -translate-x-full mr-4 hidden md:block transition-colors duration-500"
              style={{ backgroundColor: currentTheme.foreground }}
            />
            <h1
              className="relative text-4xl md:text-5xl lg:text-6xl font-light tracking-tight transition-colors duration-500"
              style={{ color: currentTheme.text }}
            >
              <span className="font-medium" style={{ color: currentTheme.foreground }}>
                Podcast
              </span>{' '}
              Generator
            </h1>
            <div
              className="absolute top-1/2 right-0 w-16 h-px transform -translate-y-1/2 translate-x-full ml-4 hidden md:block transition-colors duration-500"
              style={{ backgroundColor: currentTheme.foreground }}
            />
          </div>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed transition-colors duration-500"
            style={{ color: currentTheme.textSecondary }}
          >
            Transform your ideas into professional audio with AI-powered text-to-speech
          </p>
        </header>

        {/* Podcast Templates Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
              style={{ backgroundColor: currentTheme.backgroundSecondary }}
            >
              <FileText
                className="w-5 h-5 transition-colors duration-300"
                style={{ color: currentTheme.foreground }}
              />
            </div>
            <div>
              <h2
                className="text-xl font-medium transition-colors duration-500"
                style={{ color: currentTheme.text }}
              >
                Podcast Templates
              </h2>
              <p
                className="text-sm transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                Click on a template to use it for your podcast
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PODCAST_TEMPLATES.map((template) => {
              const IconComponent = template.icon
              return (
                <Card
                  key={template.id}
                  className="backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{
                    backgroundColor: currentTheme.card,
                    border: `1px solid ${currentTheme.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.cardHover
                    e.currentTarget.style.borderColor = currentTheme.foreground
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.card
                    e.currentTarget.style.borderColor = currentTheme.border
                  }}
                  onClick={() => handleUseTemplate(template)}
                >
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
                        style={{ backgroundColor: currentTheme.backgroundSecondary }}
                      >
                        <IconComponent
                          className="w-5 h-5 transition-colors duration-300"
                          style={{ color: currentTheme.foreground }}
                        />
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium transition-colors duration-300"
                        style={{
                          backgroundColor: `${currentTheme.foreground}15`,
                          color: currentTheme.foreground,
                        }}
                      >
                        {template.category}
                      </span>
                    </div>

                    <h3
                      className="text-base font-medium mb-2 transition-colors duration-300 group-hover:underline"
                      style={{ color: currentTheme.text }}
                    >
                      {template.title}
                    </h3>

                    <p
                      className="text-sm mb-4 line-clamp-2 transition-colors duration-300"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      {template.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs transition-colors duration-300"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{template.characterCount} chars</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{template.estimatedDuration}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex items-center justify-between transition-colors duration-300"
                      style={{ borderColor: `${currentTheme.border}80` }}
                    >
                      <span
                        className="text-xs font-medium transition-colors duration-300"
                        style={{ color: currentTheme.foreground }}
                      >
                        Click to use
                      </span>
                      <Zap
                        className="w-4 h-4 transition-all duration-300 group-hover:scale-110"
                        style={{ color: currentTheme.foreground }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tts" className="space-y-6">
          <TabsList
            className="grid w-full grid-cols-2 backdrop-blur-sm shadow-sm p-1 transition-all duration-500"
            style={{
              backgroundColor: currentTheme.card,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <TabsTrigger
              value="tts"
              className="transition-all duration-300 font-medium"
              style={{
                color: currentTheme.text,
              }}
              data-active-style={{
                backgroundColor: currentTheme.foreground,
                color: currentTheme.background,
              }}
            >
              Text to Speech
            </TabsTrigger>
            <TabsTrigger
              value="asr"
              className="transition-all duration-300 font-medium"
              style={{
                color: currentTheme.text,
              }}
            >
              Speech Recognition
            </TabsTrigger>
          </TabsList>

          {/* TTS Tab */}
          <TabsContent value="tts" className="space-y-6 transition-opacity duration-500">
            <Card
              className="backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500"
              style={{
                backgroundColor: currentTheme.card,
                border: `1px solid ${currentTheme.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.cardHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.card
              }}
            >
              <CardHeader
                className="border-b transition-colors duration-500"
                style={{ borderColor: `${currentTheme.border}80` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
                    style={{ backgroundColor: currentTheme.backgroundSecondary }}
                  >
                    <Sparkles
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: currentTheme.foreground }}
                    />
                  </div>
                  <div>
                    <CardTitle
                      className="text-xl font-medium transition-colors duration-500"
                      style={{ color: currentTheme.text }}
                    >
                      Create Your Podcast
                    </CardTitle>
                    <CardDescription
                      className="text-sm transition-colors duration-500"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      Enter your content, choose a voice, and generate professional audio
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Text Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label
                      className="text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500"
                      style={{ color: currentTheme.foreground }}
                    >
                      Podcast Content
                    </label>
                    <div
                      className="text-xs font-light transition-colors duration-500 px-3 py-1 rounded-full"
                      style={{
                        color: currentTheme.textSecondary,
                        backgroundColor: currentTheme.input,
                      }}
                    >
                      {getCharacterCount()} characters · Est. {getEstimatedDuration()}
                    </div>
                  </div>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your podcast content here...

Example: Welcome to today's episode. We'll explore how artificial intelligence is transforming our daily lives and the endless possibilities it brings..."
                    className="min-h-[200px] resize-none transition-all duration-300"
                    style={{
                      backgroundColor: currentTheme.input,
                      borderColor: currentTheme.border,
                      color: currentTheme.text,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = currentTheme.foreground
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = currentTheme.border
                    }}
                  />
                </div>

                {/* Voice Selection */}
                <div className="space-y-3">
                  <label
                    className="text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500"
                    style={{ color: currentTheme.foreground }}
                  >
                    Voice Style
                  </label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger
                      className="transition-all duration-300"
                      style={{
                        backgroundColor: currentTheme.input,
                        borderColor: currentTheme.border,
                        color: currentTheme.text,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = currentTheme.foreground
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = currentTheme.border
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="backdrop-blur-sm shadow-lg transition-colors duration-500"
                      style={{
                        backgroundColor: currentTheme.background,
                        borderColor: currentTheme.border,
                      }}
                    >
                      {VOICE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="transition-colors duration-300"
                          style={{
                            color: currentTheme.text,
                          }}
                          data-hover-style={{
                            backgroundColor: currentTheme.backgroundSecondary,
                          }}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Control */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label
                      className="text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500"
                      style={{ color: currentTheme.foreground }}
                    >
                      Speaking Speed
                    </label>
                    <span
                      className="text-xs font-light px-3 py-1.5 rounded-full transition-colors duration-500"
                      style={{
                        color: currentTheme.textSecondary,
                        backgroundColor: currentTheme.input,
                      }}
                    >
                      {speed[0].toFixed(1)}x
                    </span>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="[&_[role=slider]]:border-4 [&_[role=slider]]:border-white transition-all duration-300"
                      style={{
                        '[&_[role=slider]]': {
                          backgroundColor: currentTheme.foreground,
                        },
                      }}
                    />
                  </div>
                  <div
                    className="flex justify-between text-xs font-light px-2 transition-colors duration-500"
                    style={{ color: currentTheme.textSecondary }}
                  >
                    <span>Slow (0.5x)</span>
                    <span>Normal (1.0x)</span>
                    <span>Fast (2.0x)</span>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !text.trim()}
                  className="w-full h-14 font-medium text-base shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentTheme.foreground,
                    color: currentTheme.background,
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating && text.trim()) {
                      e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.foreground
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Podcast
                    </>
                  )}
                </Button>

                {/* Audio Player */}
                {audio.audioUrl && (
                  <div className="mt-8 pt-6 space-y-5" style={{ borderTop: `1px solid ${currentTheme.border}80` }}>
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-lg font-medium transition-colors duration-500"
                        style={{ color: currentTheme.text }}
                      >
                        Preview
                      </h3>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300"
                        style={{
                          borderColor: currentTheme.border,
                          color: currentTheme.text,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.backgroundSecondary
                          e.currentTarget.style.borderColor = currentTheme.foreground
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = currentTheme.border
                        }}
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <div
                      className="rounded-2xl p-6 space-y-5"
                      style={{
                        background: `linear-gradient(to bottom right, ${currentTheme.backgroundSecondary}80, ${currentTheme.input}80)`,
                        border: `1px solid ${currentTheme.border}`,
                      }}
                    >
                      <audio
                        ref={audioRef}
                        src={audio.audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleTimeUpdate}
                        onEnded={handleAudioEnded}
                      />

                      <div className="space-y-4">
                        <Slider
                          value={[audio.currentTime]}
                          onValueChange={handleSeek}
                          max={audio.duration || 0}
                          step={0.1}
                          className="[&_[role=slider]]:border-4 [&_[role=slider]]:border-white transition-all duration-300"
                          style={{
                            '[&_[role=slider]]': {
                              backgroundColor: currentTheme.foreground,
                            },
                          }}
                        />
                        <div
                          className="flex justify-between text-xs font-light transition-colors duration-500"
                          style={{ color: currentTheme.textSecondary }}
                        >
                          <span>{formatTime(audio.currentTime)}</span>
                          <span>{formatTime(audio.duration)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <Button
                          onClick={handlePlayPause}
                          size="lg"
                          className="w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                          style={{
                            backgroundColor: currentTheme.foreground,
                            color: currentTheme.background,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foreground
                          }}
                        >
                          {audio.isPlaying ? (
                            <Pause className="w-7 h-7" />
                          ) : (
                            <Play className="w-7 h-7 ml-1" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ASR Tab */}
          <TabsContent value="asr" className="space-y-6 transition-opacity duration-500">
            <Card
              className="backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500"
              style={{
                backgroundColor: currentTheme.card,
                border: `1px solid ${currentTheme.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.cardHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.card
              }}
            >
              <CardHeader
                className="border-b transition-colors duration-500"
                style={{ borderColor: `${currentTheme.border}80` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
                    style={{ backgroundColor: currentTheme.backgroundSecondary }}
                  >
                    <Mic
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: currentTheme.foreground }}
                    />
                  </div>
                  <div>
                    <CardTitle
                      className="text-xl font-medium transition-colors duration-500"
                      style={{ color: currentTheme.text }}
                    >
                      Speech Recognition
                    </CardTitle>
                    <CardDescription
                      className="text-sm transition-colors duration-500"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      Record your voice, transcribe it to text, and use it for podcast generation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Recording Section */}
                <div className="space-y-3">
                  <label
                    className="text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500"
                    style={{ color: currentTheme.foreground }}
                  >
                    Record Audio
                  </label>

                  <div
                    className="rounded-2xl p-6 space-y-4"
                    style={{
                      background: `linear-gradient(to bottom right, ${currentTheme.backgroundSecondary}80, ${currentTheme.input}80)`,
                      border: `1px solid ${currentTheme.border}`,
                    }}
                  >
                    {asr.isRecording ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div
                              className="absolute inset-0 rounded-full animate-ping"
                              style={{ backgroundColor: `${currentTheme.foreground}40` }}
                            />
                            <div
                              className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                              style={{ backgroundColor: currentTheme.foreground }}
                            >
                              <Square className="w-6 h-6" style={{ color: currentTheme.background }} />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p
                            className="text-2xl font-light transition-colors duration-500"
                            style={{ color: currentTheme.text }}
                          >
                            {formatRecordingTime(asr.recordingTime)}
                          </p>
                          <p
                            className="text-xs mt-1 transition-colors duration-500"
                            style={{ color: currentTheme.textSecondary }}
                          >
                            Recording...
                          </p>
                        </div>
                        <Button
                          onClick={stopRecording}
                          className="w-full font-medium transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.foreground,
                            color: currentTheme.background,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foreground
                          }}
                        >
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </Button>

                        {/* Audio visualization canvas */}
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={100}
                          className="w-full h-24 rounded-lg transition-colors duration-500"
                          style={{
                            backgroundColor: currentTheme.background,
                            border: `1px solid ${currentTheme.border}`,
                          }}
                        />
                      </div>
                    ) : asr.recordedUrl ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <audio src={asr.recordedUrl} controls className="w-full max-w-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={startRecording}
                            variant="outline"
                            className="transition-all duration-300"
                            style={{
                              borderColor: currentTheme.border,
                              color: currentTheme.text,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = currentTheme.backgroundSecondary
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Mic className="w-4 h-4 mr-2" />
                            Record Again
                          </Button>
                          <Button
                            onClick={handleTranscribe}
                            disabled={asr.isTranscribing}
                            className="font-medium transition-all duration-300"
                            style={{
                              backgroundColor: currentTheme.foreground,
                              color: currentTheme.background,
                            }}
                            onMouseEnter={(e) => {
                              if (!asr.isTranscribing) {
                                e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = currentTheme.foreground
                            }}
                          >
                            {asr.isTranscribing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Languages className="w-4 h-4 mr-2" />
                                Transcribe
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-500"
                            style={{ backgroundColor: currentTheme.backgroundSecondary }}
                          >
                            <Mic
                              className="w-8 h-8 transition-colors duration-300"
                              style={{ color: `${currentTheme.textSecondary}99` }}
                            />
                          </div>
                        </div>
                        <p
                          className="text-center text-sm font-light transition-colors duration-500"
                          style={{ color: currentTheme.textSecondary }}
                        >
                          Click to start recording your voice
                        </p>
                        <Button
                          onClick={startRecording}
                          className="w-full font-medium transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.foreground,
                            color: currentTheme.background,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foreground
                          }}
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transcription Section */}
                {asr.transcription && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        className="text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500"
                        style={{ color: currentTheme.foreground }}
                      >
                        Transcription
                      </label>
                      <Button
                        onClick={() => handleCopyText(asr.transcription)}
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300"
                        style={{
                          borderColor: currentTheme.border,
                          color: currentTheme.text,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.backgroundSecondary
                          e.currentTarget.style.borderColor = currentTheme.foreground
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = currentTheme.border
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>

                    <div
                      className="rounded-2xl p-4 space-y-4"
                      style={{
                        background: `linear-gradient(to bottom right, ${currentTheme.backgroundSecondary}80, ${currentTheme.input}80)`,
                        border: `1px solid ${currentTheme.border}`,
                      }}
                    >
                      <Textarea
                        value={asr.transcription}
                        readOnly
                        placeholder="Transcription will appear here..."
                        className="min-h-[150px] resize-none transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.input,
                          borderColor: currentTheme.border,
                          color: currentTheme.text,
                        }}
                      />

                      <Button
                        onClick={() => handleCopyToTTS(asr.transcription)}
                        className="w-full font-medium transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.foreground,
                          color: currentTheme.background,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.foreground
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Use for Podcast
                      </Button>
                    </div>
                  </div>
                )}

                {/* Translation Section */}
                {asr.transcription && (
                  <div className="space-y-3">
                    <label
                      className="text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500"
                      style={{ color: currentTheme.foreground }}
                    >
                      Translation
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        value={asr.selectedLanguage}
                        onValueChange={(value) => setAsr(prev => ({ ...prev, selectedLanguage: value }))}
                      >
                        <SelectTrigger
                          className="transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.input,
                            borderColor: currentTheme.border,
                            color: currentTheme.text,
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = currentTheme.foreground
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = currentTheme.border
                          }}
                        >
                          <SelectValue placeholder="Target Language" />
                        </SelectTrigger>
                        <SelectContent
                          className="backdrop-blur-sm shadow-lg transition-colors duration-500"
                          style={{
                            backgroundColor: currentTheme.background,
                            borderColor: currentTheme.border,
                          }}
                        >
                          {LANGUAGE_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="transition-colors duration-300"
                              style={{
                                color: currentTheme.text,
                              }}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={handleTranslate}
                        disabled={asr.isTranslating}
                        className="md:col-span-2 font-medium transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.foreground,
                          color: currentTheme.background,
                        }}
                        onMouseEnter={(e) => {
                          if (!asr.isTranslating) {
                            e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.foreground
                        }}
                      >
                        {asr.isTranslating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Translating...
                          </>
                        ) : (
                          <>
                            <Languages className="w-4 h-4 mr-2" />
                            Translate Text
                          </>
                        )}
                      </Button>
                    </div>

                    {asr.translatedText && (
                      <div
                        className="rounded-2xl p-4 space-y-4"
                        style={{
                          background: `linear-gradient(to bottom right, ${currentTheme.backgroundSecondary}80, ${currentTheme.input}80)`,
                          border: `1px solid ${currentTheme.border}`,
                        }}
                      >
                        <Textarea
                          value={asr.translatedText}
                          readOnly
                          placeholder="Translation will appear here..."
                          className="min-h-[150px] resize-none transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.input,
                            borderColor: currentTheme.border,
                            color: currentTheme.text,
                          }}
                        />

                        <Button
                          onClick={() => handleCopyToTTS(asr.translatedText)}
                          className="w-full font-medium transition-all duration-300"
                          style={{
                            backgroundColor: currentTheme.foreground,
                            color: currentTheme.background,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foregroundSecondary
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.foreground
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Use for Podcast
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <Card
            className="backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500"
            style={{
              backgroundColor: currentTheme.card,
              border: `1px solid ${currentTheme.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.cardHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.card
            }}
          >
            <CardContent className="pt-7 text-center">
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ backgroundColor: currentTheme.backgroundSecondary }}
              >
                <Volume2
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: currentTheme.foreground }}
                />
              </div>
              <h3
                className="font-medium mb-2 text-base transition-colors duration-500"
                style={{ color: currentTheme.text }}
              >
                Multiple Voices
              </h3>
              <p
                className="text-sm font-light transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                7 professional voice styles for every scenario
              </p>
            </CardContent>
          </Card>

          <Card
            className="backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500"
            style={{
              backgroundColor: currentTheme.card,
              border: `1px solid ${currentTheme.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.cardHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.card
            }}
          >
            <CardContent className="pt-7 text-center">
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ backgroundColor: currentTheme.backgroundSecondary }}
              >
                <Mic
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: currentTheme.foreground }}
                />
              </div>
              <h3
                className="font-medium mb-2 text-base transition-colors duration-500"
                style={{ color: currentTheme.text }}
              >
                Speech Recognition
              </h3>
              <p
                className="text-sm font-light transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                Voice-to-text with translation support
              </p>
            </CardContent>
          </Card>

          <Card
            className="backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-500"
            style={{
              backgroundColor: currentTheme.card,
              border: `1px solid ${currentTheme.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.cardHover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.card
            }}
          >
            <CardContent className="pt-7 text-center">
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ backgroundColor: currentTheme.backgroundSecondary }}
              >
                <DownloadIcon
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: currentTheme.foreground }}
                />
              </div>
              <h3
                className="font-medium mb-2 text-base transition-colors duration-500"
                style={{ color: currentTheme.text }}
              >
                Easy Download
              </h3>
              <p
                className="text-sm font-light transition-colors duration-500"
                style={{ color: currentTheme.textSecondary }}
              >
                Download your podcast audio anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t backdrop-blur-sm mt-auto transition-all duration-500"
        style={{
          borderColor: currentTheme.border,
          backgroundColor: `${currentTheme.card}80`,
        }}
      >
        <div className="container max-w-5xl mx-auto px-4 py-7">
          <div
            className="text-center text-sm font-light transition-colors duration-500"
            style={{ color: currentTheme.textSecondary }}
          >
            <p>Powered by Z.ai TTS & ASR Technology</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
