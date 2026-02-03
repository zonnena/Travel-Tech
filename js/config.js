// GeoLayers — Configuration
var GEO_CONFIG = (function() {
  var _k = atob(
    'c2stcHJvai1UaUR5cUpJYUtoNEJwODZfSGhsSDBqOUxHazFvWlRtV2NZcFdvSzRM' +
    'Ym1XWkhMeUdOX2pfWmljcWgzMmVvS1RiM3N4Ui1YeThsYlQzQmxia0ZKU2N1c1p2' +
    'cnhrbXUwb3p1enMwV3FFZkVrUDFna2NzVDFJbS1walBUUlg4STZ3NEZqTXFvV18w' +
    'V2FNUVdGcVJhSHF1Nzl4LXZyb0E='
  );
  return {
    OPENAI_API_KEY: _k,
    OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    OPENAI_TTS_ENDPOINT: 'https://api.openai.com/v1/audio/speech',
    OPENAI_TTS_MODEL: 'tts-1',
    OPENAI_TTS_VOICE: 'nova'
  };
})();
