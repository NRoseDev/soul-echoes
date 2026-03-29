---
name: Onboarding flow
description: 5-step onboarding with language, sign language, up to 3 comm methods, voice setup, and confirmation
type: feature
---
5-step onboarding gates the app until complete:
1. Welcome — speaks greeting, large text display
2. Language — primary language, optional second, optional sign language. Speak-then-listen with fuzzy matching.
3. Communication — up to 3 methods from 8 options. Multi-select toggle buttons.
4. Voice Setup — gender pref, speed/volume sliders, voice picker with preview, test button
5. Confirmation — speaks welcome, saves all prefs, opens Brain Dump

Preferences stored in localStorage under "soul-echoes-preferences":
- communicationMethods: string[] (up to 3)
- primaryLanguage, secondaryLanguage, signLanguageEnabled, autoReadEnabled

Voice settings stored separately under "soul-echoes-voice-settings".
