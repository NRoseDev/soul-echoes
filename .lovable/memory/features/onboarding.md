---
name: Onboarding flow
description: 6-step onboarding with welcome, language, communication, safety angel, voice setup, and confirmation
type: feature
---
6-step onboarding gates the app until complete:
1. Welcome — speaks greeting, large text display, auto-advances after 8s or tap
2. Language — primary language, optional second, optional sign language. Speak-then-listen with fuzzy matching. ASL camera option.
3. Communication — up to 3 methods from 8 options. Multi-select toggle buttons. Voice and tap input.
4. Safety Angel — pick Michael or Faith unicorn, set private access method (PIN/codeword/symbol/color sequence/sign/pattern)
5. Voice Setup — gender pref, speed/volume sliders, voice picker with preview, test button
6. Confirmation — speaks welcome, saves all prefs, opens Brain Dump

Preferences stored in localStorage under "soul-echoes-preferences":
- communicationMethods: string[] (up to 3)
- primaryLanguage, secondaryLanguage, signLanguageEnabled, autoReadEnabled

Safety settings stored under "soul-echoes-safety"
Voice settings stored under "soul-echoes-voice-settings"
