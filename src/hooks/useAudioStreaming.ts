import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface UseAudioStreamingOptions {
  language?: string;
  onTranscriptUpdate?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

interface UseAudioStreamingReturn {
  isRecording: boolean;
  isProcessing: boolean;
  interimTranscript: string;
  finalTranscript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetTranscript: () => void;
}

// Extend Window interface for browser speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useAudioStreaming(
  options: UseAudioStreamingOptions = {}
): UseAudioStreamingReturn {
  const { language = "en-US", onTranscriptUpdate, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");

  const recognitionRef = useRef<any>(null);
  const isStoppingRef = useRef<boolean>(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if browser supports Speech Recognition
  const isSpeechRecognitionSupported = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!isSpeechRecognitionSupported()) {
      const error = new Error(
        "Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      onError?.(error);
      toast.error(
        "Speech Recognition not supported. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    if (!recognitionRef.current) {
      const error = new Error("Speech Recognition not initialized");
      onError?.(error);
      toast.error("Speech Recognition not initialized");
      return;
    }

    // Reset stopping flag when starting
    isStoppingRef.current = false;

    const recognition = recognitionRef.current;

    // Handle results (live transcription)
    recognition.onresult = (event: any) => {
      if (isStoppingRef.current) return;

      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // Update interim transcript (live translation effect)
      if (interim) {
        setInterimTranscript(interim);
        setIsProcessing(true);
        onTranscriptUpdate?.(interim, false);
      }

      // Update final transcript
      if (final) {
        const trimmedFinal = final.trim();
        setFinalTranscript((prev: string) =>
          prev ? `${prev} ${trimmedFinal}` : trimmedFinal
        );
        setInterimTranscript("");
        setIsProcessing(false);
        onTranscriptUpdate?.(trimmedFinal, true);
      }
    };

    // Handle errors
    recognition.onerror = (event: any) => {
      if (isStoppingRef.current) return;

      console.error("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        // Silently continue, this is normal
        return;
      }

      if (event.error === "aborted") {
        // User stopped, don't show error
        return;
      }

      if (event.error === "not-allowed") {
        const error = new Error(
          "Microphone access denied. Please enable microphone permissions."
        );
        onError?.(error);
        toast.error(
          "Microphone access denied. Please enable permissions in your browser."
        );
        setIsRecording(false);
        return;
      }

      const error = new Error(`Speech recognition error: ${event.error}`);
      onError?.(error);
      toast.error("Speech recognition error occurred");
    };

    // Handle end event (restart for continuous recognition)
    recognition.onend = () => {
      if (isStoppingRef.current || !isRecording) return;

      // Auto-restart recognition for continuous listening
      restartTimeoutRef.current = setTimeout(() => {
        if (!isStoppingRef.current && isRecording) {
          try {
            recognition.start();
          } catch (error) {
            console.error("Error restarting recognition:", error);
          }
        }
      }, 100);
    };

    // Start recognition
    try {
      recognition.start();
      setIsRecording(true);
      toast.success("Listening... Speak naturally", {
        duration: 2000,
        icon: "🎤",
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to start speech recognition");
      onError?.(err);
      toast.error("Failed to start speech recognition");
    }
  }, [isSpeechRecognitionSupported, isRecording, onTranscriptUpdate, onError]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    // Set stopping flag immediately to prevent new operations
    isStoppingRef.current = true;

    // Clear restart timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }

    setIsRecording(false);
    setIsProcessing(false);

    // Clear interim transcript when stopping
    setInterimTranscript("");

    toast.success("Recording stopped", {
      duration: 1500,
    });

    // Reset stopping flag after a brief delay
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 100);
  }, []);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
  }, []);

  return {
    isRecording,
    isProcessing,
    interimTranscript,
    finalTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
  };
}
