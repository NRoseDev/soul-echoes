export function cleanForSpeech(text: string) {
  return text
    // remove emojis
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    // remove weird symbols / stray characters
    .replace(/[^\w\s.,!?'-]/g, "")
    // collapse spaces
    .replace(/\s+/g, " ")
    .trim();
}

export function speak(text: string) {
  const cleaned = cleanForSpeech(text);

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.rate = 0.9;

  speechSynthesis.cancel(); // stop stacking voices
  speechSynthesis.speak(utterance);
}
