"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Send, Volume2, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Types for Speech Recognition
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export function VoiceTutor({ initialGreeting = "Hello! I'm your AI Tutor. What would you like to learn today?" }) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [transcript, setTranscript] = useState("")
    const [conversation, setConversation] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: initialGreeting }
    ])
    const [inputValue, setInputValue] = useState("")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null)

    // Initialize TTS and STT
    useEffect(() => {
        // Speak initial greeting
        debouncedSpeak(initialGreeting)

        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition } = window as unknown as IWindow;
            if (webkitSpeechRecognition) {
                const recognition = new webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-UK'; // British English

                recognition.onstart = () => setIsListening(true);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recognition.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const result = event.results[current];
                    const transcriptValue = result[0].transcript;
                    setInputValue(transcriptValue);
                };

                recognition.onend = () => {
                    setIsListening(false);
                    // Auto-submit if we have a result? Optional.
                };

                recognitionRef.current = recognition;
            }
        }
    }, [])

    const debouncedSpeak = (text: string) => {
        // Mock speaking state for animation
        setIsSpeaking(true);

        // Use browser TTS
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            // Try to pick a British voice
            const voices = window.speechSynthesis.getVoices();
            const britishVoice = voices.find(v => v.lang.includes('GB')) || voices[0];
            if (britishVoice) utterance.voice = britishVoice;

            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback timeout
            setTimeout(() => setIsSpeaking(false), 3000);
        }
    }

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setConversation(prev => [...prev, { role: 'user', text: userMessage }]);
        setInputValue("");

        // Simulate AI Response
        setTimeout(() => {
            const aiResponses = [
                "That's a great question! Let's break it down together.",
                "Excellent observation. Can you tell me more about why you think that?",
                "You're doing fantastic! Would you like to try a practice problem?",
                "I see where you're coming from. In the UK curriculum, we usually approach this by..."
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

            setConversation(prev => [...prev, { role: 'ai', text: randomResponse }]);
            debouncedSpeak(randomResponse);
        }, 1000);
    }

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition not supported in this browser. Please try Chrome.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
            {/* Visualizer Area */}
            <div className="flex-1 relative flex items-center justify-center bg-black/5 rounded-3xl overflow-hidden mb-6 p-8 min-h-[300px]">
                {/* Background Ambient Animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                {/* Main Orb */}
                <div className="relative z-10">
                    <motion.div
                        animate={{
                            scale: isSpeaking ? [1, 1.2, 1] : 1,
                            boxShadow: isSpeaking
                                ? "0 0 50px 10px rgba(var(--primary), 0.5)"
                                : "0 0 20px 0px rgba(var(--primary), 0.1)"
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: isSpeaking ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-xl"
                    >
                        {isSpeaking ? (
                            <Volume2 className="h-12 w-12 text-white" />
                        ) : (
                            <Globe className="h-12 w-12 text-white/80" />
                        )}
                    </motion.div>

                    {/* Ripple Effects when listening */}
                    {isListening && (
                        <>
                            <motion.div
                                initial={{ opacity: 0.5, scale: 1 }}
                                animate={{ opacity: 0, scale: 2 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 rounded-full border-2 border-primary"
                            />
                        </>
                    )}
                </div>

                {/* Transcript Overlay */}
                <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={conversation[conversation.length - 1]?.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-lg md:text-xl font-medium text-foreground/80 max-w-2xl mx-auto bg-background/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm"
                        >
                            {conversation[conversation.length - 1]?.text}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center bg-card p-2 rounded-full shadow-lg border max-w-2xl mx-auto w-full">
                <Button
                    size="icon"
                    variant={isListening ? "destructive" : "default"}
                    className="h-12 w-12 rounded-full shrink-0"
                    onClick={toggleListening}
                >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <form
                    className="flex-1 flex gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type or speak (e.g. 'Explain fractions')"
                        className="border-0 shadow-none focus-visible:ring-0 bg-transparent px-2"
                    />
                    <Button type="submit" size="icon" variant="ghost" className="shrink-0">
                        <Send className="h-5 w-5 text-primary" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
