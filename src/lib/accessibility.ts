import { getPreferences } from "./preferences";

export type DyslexiaFont = "default" | "opendyslexic" | "legible";

export function applyAccessibility(opts?: {
  dyslexiaFont?: DyslexiaFont;
  calmTones?: boolean;
}) {
  const prefs = getPreferences() as any;
  const font: DyslexiaFont = opts?.dyslexiaFont ?? prefs.dyslexiaFont ?? "default";
  const calm: boolean = opts?.calmTones ?? prefs.calmTones ?? false;

  const root = document.documentElement;
  root.classList.remove("font-dyslexic", "font-legible", "font-default");
  root.classList.add(
    font === "opendyslexic" ? "font-dyslexic" : font === "legible" ? "font-legible" : "font-default"
  );
  root.classList.toggle("calm-tones", calm);
}
