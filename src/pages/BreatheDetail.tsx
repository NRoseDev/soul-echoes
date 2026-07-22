import { useEffect } from "react";

function cleanForSpeech(text: string) {
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
}

function speak(text: string) {
  const cleaned = cleanForSpeech(text);
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  speechSynthesis.cancel(); // stops overlap
  speechSynthesis.speak(utterance);
}

const steps = [
  "🌬 Breathe in slowly through your nose for 4 seconds",
  "😌 Hold your breath gently for 4 seconds",
  "💨 Exhale slowly through your mouth for 6 seconds",
  "🫁 Let your body soften and relax",
];

export default function BreatheDetail() {
  useEffect(() => {
    let i = 0;

    function runSteps() {
      if (i >= steps.length) return;
      speak(steps[i]);
      i++;
      setTimeout(runSteps, 5000);
    }

    runSteps();

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h1 className="text-2xl font-bold mb-6">🌬 Breathe</h1>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <p key={index} className="text-lg">
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}
