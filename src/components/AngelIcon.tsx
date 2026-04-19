/**
 * Angel wings illustration — two large feathered wings spread open.
 * Gradient: deep green at the base fading to white at the wingtips.
 * No face, no body.
 */

let _uid = 0;
function uid() { return ++_uid; }

import { useRef } from "react";

export default function AngelIcon({ className = "h-6 w-6" }: { className?: string }) {
  // Stable unique ID per instance so multiple wings on screen don't share gradient IDs
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) idRef.current = uid();
  const g = `sewg${idRef.current}`;   // gradient id
  const f = `sewf${idRef.current}`;   // filter id

  return (
    <svg
      viewBox="0 0 80 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Radial gradient: rich green at wing base → white at wingtips */}
        <radialGradient id={g} cx="40" cy="44" r="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#15803d" stopOpacity="1"   />
          <stop offset="18%"  stopColor="#22c55e" stopOpacity="0.97"/>
          <stop offset="40%"  stopColor="#4ade80" stopOpacity="0.92"/>
          <stop offset="62%"  stopColor="#86efac" stopOpacity="0.88"/>
          <stop offset="80%"  stopColor="#dcfce7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1"   />
        </radialGradient>

        {/* Green glow around the wings */}
        <filter id={f} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
          <feColorMatrix
            in="blur" type="matrix"
            values="0 0 0 0 0.13  0 0 0 0 0.77  0 0 0 0 0.36  0 0 0 0.75 0"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ═══ ALL WING PATHS — wrapped in glow filter ═══ */}
      <g filter={`url(#${f})`}>

        {/* ── LEFT WING ── */}

        {/* Primary feathers — outermost layer, the longest sweep */}
        <path
          d="
            M40,44
            C35,36 25,26 15,17
            C9,11 3,7 3,7
            C2,5 3,4 5,5
            C9,6 16,12 24,20
            C32,28 38,37 40,44
            Z"
          fill={`url(#${g})`}
        />

        {/* Secondary feathers — slightly shorter, overlaps primary */}
        <path
          d="
            M40,44
            C36,37 28,29 20,22
            C15,17 11,13 11,13
            C12,12 15,14 19,18
            C26,25 35,36 40,44
            Z"
          fill={`url(#${g})`}
          opacity="0.78"
        />

        {/* Tertiary feathers — closer to body, shorter */}
        <path
          d="
            M40,44
            C37,39 31,33 25,28
            C22,24 19,21 20,20
            C21,19 23,22 26,25
            C31,30 37,39 40,44
            Z"
          fill={`url(#${g})`}
          opacity="0.58"
        />

        {/* Covert feathers — innermost short row */}
        <path
          d="
            M40,44
            C38,41 35,38 31,34
            C29,32 27,30 27,30
            C28,29 30,31 32,34
            C35,37 38,42 40,44
            Z"
          fill={`url(#${g})`}
          opacity="0.42"
        />

        {/* Left feather crease lines — white, semi-transparent */}
        <path d="M40,44 C31,33 18,21 6,10"   fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.85" strokeLinecap="round" />
        <path d="M40,44 C33,35 22,25 13,16"  fill="none" stroke="white" strokeOpacity="0.42" strokeWidth="0.72" strokeLinecap="round" />
        <path d="M40,44 C35,37 26,29 18,22"  fill="none" stroke="white" strokeOpacity="0.38" strokeWidth="0.68" strokeLinecap="round" />
        <path d="M40,44 C36,38 29,32 22,26"  fill="none" stroke="white" strokeOpacity="0.32" strokeWidth="0.60" strokeLinecap="round" />
        <path d="M40,44 C37,40 32,35 27,31"  fill="none" stroke="white" strokeOpacity="0.26" strokeWidth="0.55" strokeLinecap="round" />

        {/* Left wingtip feather splits — tiny detail at the tip */}
        <path d="M3,7 C3,5 5,4 6,5"   fill="none" stroke="white" strokeOpacity="0.65" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M6,9 C7,7 9,6 10,7"  fill="none" stroke="white" strokeOpacity="0.50" strokeWidth="0.55" strokeLinecap="round" />
        <path d="M9,11 C11,9 13,9 13,10" fill="none" stroke="white" strokeOpacity="0.40" strokeWidth="0.50" strokeLinecap="round" />

        {/* ── RIGHT WING (mirror: x → 80 − x) ── */}

        {/* Primary feathers */}
        <path
          d="
            M40,44
            C45,36 55,26 65,17
            C71,11 77,7 77,7
            C78,5 77,4 75,5
            C71,6 64,12 56,20
            C48,28 42,37 40,44
            Z"
          fill={`url(#${g})`}
        />

        {/* Secondary feathers */}
        <path
          d="
            M40,44
            C44,37 52,29 60,22
            C65,17 69,13 69,13
            C68,12 65,14 61,18
            C54,25 45,36 40,44
            Z"
          fill={`url(#${g})`}
          opacity="0.78"
        />

        {/* Tertiary feathers */}
        <path
          d="
            M40,44
            C43,39 49,33 55,28
            C58,24 61,21 60,20
            C59,19 57,22 54,25
            C49,30 43,39 40,44
            Z"
          fill={`url(#${g})`}
          opacity="0.58"
        />

        {/* Covert feathers */}
        <path
          d="
            M40,44
            C42,41 45,38 49,34
            C51,32 53,30 53,30
            C52,29 50,31 48,34
            C45,37 42,42 40,44
            Z"
          fill={`url(#${g})`}
          opacity="0.42"
        />

        {/* Right feather crease lines */}
        <path d="M40,44 C49,33 62,21 74,10"  fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="0.85" strokeLinecap="round" />
        <path d="M40,44 C47,35 58,25 67,16"  fill="none" stroke="white" strokeOpacity="0.42" strokeWidth="0.72" strokeLinecap="round" />
        <path d="M40,44 C45,37 54,29 62,22"  fill="none" stroke="white" strokeOpacity="0.38" strokeWidth="0.68" strokeLinecap="round" />
        <path d="M40,44 C44,38 51,32 58,26"  fill="none" stroke="white" strokeOpacity="0.32" strokeWidth="0.60" strokeLinecap="round" />
        <path d="M40,44 C43,40 48,35 53,31"  fill="none" stroke="white" strokeOpacity="0.26" strokeWidth="0.55" strokeLinecap="round" />

        {/* Right wingtip feather splits */}
        <path d="M77,7 C77,5 75,4 74,5"    fill="none" stroke="white" strokeOpacity="0.65" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M74,9 C73,7 71,6 70,7"    fill="none" stroke="white" strokeOpacity="0.50" strokeWidth="0.55" strokeLinecap="round" />
        <path d="M71,11 C69,9 67,9 67,10"  fill="none" stroke="white" strokeOpacity="0.40" strokeWidth="0.50" strokeLinecap="round" />

      </g>
    </svg>
  );
}
