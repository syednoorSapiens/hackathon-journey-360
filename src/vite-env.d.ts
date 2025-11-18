/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHISPER_API_KEY?: string;
  readonly VITE_WHISPER_ENDPOINT?: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
