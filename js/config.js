// GeoLayers — Configuration
// API key is loaded from localStorage for security.
// Set it once in your browser console: localStorage.setItem('GEO_OPENAI_KEY', 'sk-...')
var GEO_CONFIG = {
  OPENAI_API_KEY: localStorage.getItem('GEO_OPENAI_KEY') || '',
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  OPENAI_TTS_ENDPOINT: 'https://api.openai.com/v1/audio/speech',
  OPENAI_TTS_MODEL: 'tts-1',
  OPENAI_TTS_VOICE: 'nova'
};
