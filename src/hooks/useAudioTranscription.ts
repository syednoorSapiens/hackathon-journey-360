import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface UseAudioTranscriptionOptions {
  language?: string;
  temperature?: number;
  prompt?: string;
  onTranscriptionUpdate?: (text: string) => void;
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: Error) => void;
}

interface UseAudioTranscriptionReturn {
  isListening: boolean;
  isProcessing: boolean;
  currentTranscription: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  toggleListening: () => Promise<void>;
  clearTranscription: () => void;
}

const API_URL =
  "https://eua-it-hackathon.sapiens.com/api/audio/transcribe-stream";

export function useAudioTranscription(
  options: UseAudioTranscriptionOptions = {}
): UseAudioTranscriptionReturn {
  const {
    language = "en",
    temperature = 0.7,
    prompt,
    onTranscriptionUpdate,
    onTranscriptionComplete,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Determine the best supported MIME type
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      let selectedMimeType = "";
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error("No supported audio format found");
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: selectedMimeType,
          });

          // Send audio to backend for transcription
          await transcribeAudio(audioBlob, selectedMimeType);
        } catch (error) {
          const err = error as Error;
          console.error("Transcription error:", err);
          toast.error("Failed to transcribe audio");
          if (onError) {
            onError(err);
          }
        } finally {
          setIsProcessing(false);
          audioChunksRef.current = [];
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsListening(true);
      toast.success("Listening...");
    } catch (error) {
      const err = error as Error;
      console.error("Error starting recording:", err);

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        toast.error(
          "Microphone permission denied. Please enable microphone access in your browser settings."
        );
      } else if (err.name === "NotFoundError") {
        toast.error(
          "No microphone found. Please connect a microphone and try again."
        );
      } else {
        toast.error("Failed to start recording");
      }

      if (onError) {
        onError(err);
      }
    }
  }, [language, temperature, prompt, onError]);

  const stopListening = useCallback(async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }

    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  const transcribeAudio = async (audioBlob: Blob, contentType: string) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("contentType", contentType);
    formData.append("language", language);

    if (temperature !== undefined) {
      formData.append("temperature", temperature.toString());
    }

    if (prompt) {
      formData.append("prompt", prompt);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const data = await response.json();
    const transcribedText = data.text || data.transcription || "";

    if (transcribedText) {
      setCurrentTranscription(transcribedText);

      if (onTranscriptionUpdate) {
        onTranscriptionUpdate(transcribedText);
      }

      if (onTranscriptionComplete) {
        onTranscriptionComplete(transcribedText);
      }

      toast.success("Transcription complete");
    } else {
      toast.info("No speech detected");
    }
  };

  const clearTranscription = useCallback(() => {
    setCurrentTranscription("");
  }, []);

  return {
    isListening,
    isProcessing,
    currentTranscription,
    startListening,
    stopListening,
    toggleListening,
    clearTranscription,
  };
}
