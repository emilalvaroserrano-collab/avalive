export const liveServiceConfiguration = {
  "model": "publishers/google/models/gemini-3.8-live",
  "generationConfig": {
    "speechConfig": {
      "languageCode": "en-US",
      "voiceConfig": {
        "prebuiltVoiceConfig": {
          "voiceName": "puck"
        }
      }
    },
    "responseModalities": [
      "VIDEO"
    ]
  },
  "avatarConfig": {
    "avatarName": "Ben"
  }
};