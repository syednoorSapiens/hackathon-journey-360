# Audio Transcription Hook

## Overview

The `useAudioTranscription` hook provides real-time audio transcription capabilities, similar to Google Gemini Voice. It handles microphone access, audio recording, and streaming the audio to your backend API for transcription.

## Features

- **Real-time Recording**: Captures audio from the user's microphone
- **Live Transcription Updates**: Provides callback for live transcription updates
- **Automatic Format Detection**: Selects the best supported audio format (WebM, OGG, MP4)
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Permission Management**: Handles microphone permission requests
- **Processing States**: Tracks listening and transcription states

## Usage

### Basic Example

```typescript
import { useAudioTranscription } from "./hooks/useAudioTranscription";

function MyComponent() {
  const {
    isListening,
    isProcessing,
    currentTranscription,
    startListening,
    stopListening,
    toggleListening,
    clearTranscription,
  } = useAudioTranscription({
    language: "en",
    temperature: 0.7,
    onTranscriptionUpdate: (text) => {
      console.log("Live transcription:", text);
    },
    onTranscriptionComplete: (text) => {
      console.log("Final transcription:", text);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  return (
    <div>
      <button onClick={toggleListening}>
        {isListening ? "Stop" : "Start"} Recording
      </button>
      {isProcessing && <p>Processing...</p>}
      <p>{currentTranscription}</p>
    </div>
  );
}
```

### Advanced Example (PromptPanel Integration)

```typescript
const {
  isListening,
  isProcessing: isTranscribing,
  currentTranscription,
  toggleListening,
  clearTranscription,
} = useAudioTranscription({
  language: "en",
  temperature: 0.7,
  onTranscriptionUpdate: (text) => {
    // Update text input in real-time
    setCurrentPrompt(text);
  },
  onTranscriptionComplete: (text) => {
    // Final transcription result
    setCurrentPrompt(text);
    toast.success("Transcription complete");
  },
  onError: (error) => {
    console.error("Transcription error:", error);
    toast.error(error.message || "Failed to transcribe audio");
  },
});

// Sync transcription with prompt state
useEffect(() => {
  if (currentTranscription) {
    setCurrentPrompt(currentTranscription);
  }
}, [currentTranscription]);
```

## API Reference

### Parameters

```typescript
interface UseAudioTranscriptionOptions {
  language?: string; // Language code (e.g., 'en', 'es', 'fr')
  temperature?: number; // Sampling temperature (0-1)
  prompt?: string; // Guide transcription style
  onTranscriptionUpdate?: (text: string) => void; // Called during transcription
  onTranscriptionComplete?: (text: string) => void; // Called when complete
  onError?: (error: Error) => void; // Called on error
}
```

### Return Values

```typescript
interface UseAudioTranscriptionReturn {
  isListening: boolean; // Currently recording audio
  isProcessing: boolean; // Processing/transcribing audio
  currentTranscription: string; // Current transcription text
  startListening: () => Promise<void>; // Start recording
  stopListening: () => Promise<void>; // Stop recording
  toggleListening: () => Promise<void>; // Toggle recording state
  clearTranscription: () => void; // Clear current transcription
}
```

## Backend API Integration

The hook sends audio to your backend using the following endpoint:

```http
POST http://localhost:3002/api/audio/transcribe-stream
Content-Type: multipart/form-data

Fields:
- audio (required): Audio stream buffer/blob
- contentType (optional): MIME type (default: audio/webm)
- language (optional): Language code (e.g., 'en', 'es', 'fr')
- prompt (optional): Guide transcription style
- temperature (optional): Sampling temperature (0-1)
```

### Expected Response Format

```json
{
  "text": "The transcribed text from the audio",
  "language": "en",
  "duration": 5.2
}
```

or

```json
{
  "transcription": "The transcribed text from the audio"
}
```

## Audio Format Support

The hook automatically selects the best supported format in this order:

1. `audio/webm;codecs=opus` (preferred)
2. `audio/webm`
3. `audio/ogg;codecs=opus`
4. `audio/mp4`

## Error Handling

The hook handles several types of errors:

- **Permission Denied**: User denied microphone access
- **Device Not Found**: No microphone detected
- **Network Errors**: Failed to connect to backend API
- **Format Not Supported**: Browser doesn't support any audio format

## Browser Compatibility

Requires:

- MediaRecorder API
- getUserMedia API
- FormData API
- Fetch API

Supported browsers:

- Chrome/Edge 49+
- Firefox 25+
- Safari 14.1+
- Opera 36+

## Visual Feedback Examples

### Listening State

```tsx
{
  isListening && (
    <div className='flex items-center gap-2'>
      <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
      <span>Listening...</span>
    </div>
  );
}
```

### Processing State

```tsx
{
  isProcessing && (
    <div className='flex items-center gap-2'>
      <div className='flex gap-1'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='w-1 h-1 rounded-full bg-primary animate-pulse'
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span>Transcribing...</span>
    </div>
  );
}
```

## Best Practices

1. **Clear Previous Transcriptions**: Call `clearTranscription()` before starting a new recording
2. **Handle Permissions**: Always check for microphone permissions and provide clear error messages
3. **Provide Visual Feedback**: Show recording and processing states to users
4. **Error Recovery**: Implement error handlers and allow users to retry
5. **Test Audio Quality**: Ensure your backend can handle various audio formats and quality levels

## Troubleshooting

### Microphone Not Working

1. Check browser permissions (chrome://settings/content/microphone)
2. Ensure HTTPS connection (getUserMedia requires secure context)
3. Verify microphone is connected and not used by other apps

### Transcription Not Working

1. Verify backend API is running on `http://localhost:3002`
2. Check backend API endpoint and expected format
3. Review network tab for API errors
4. Ensure audio format is supported by backend

### Poor Transcription Quality

1. Reduce background noise
2. Speak clearly and at moderate pace
3. Adjust `temperature` parameter (lower = more conservative)
4. Use `prompt` parameter to guide transcription style

## Example Integration

See `src/components/PromptPanel.tsx` for a complete example of integrating the audio transcription hook with a chat-like interface, including:

- Real-time transcription display
- Visual recording indicators
- Error handling and user feedback
- Integration with text input
