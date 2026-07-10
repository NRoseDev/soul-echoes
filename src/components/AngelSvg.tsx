import type { AngelPalette } from "@/data/angelData";

interface Props {
  palette: AngelPalette;
  className?: string;
}

export default function AngelSvg({ palette: p, className }: Props) {
  return (
    <svg
      viewBox="0 0 1000 820"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="av-wL" x1="100%" y1="0%" x2="0%" y2="80%">
          <stop offset="0%" stopColor={p.wingTip} stopOpacity=".9"/>
          <stop offset="12%" stopColor={p.wingPrimary} stopOpacity=".95"/>
          <stop offset="60%" stopColor={p.wingDeep} stopOpacity=".45"/>
          <stop offset="100%" stopColor={p.atmosphere} stopOpacity=".1"/>
        </linearGradient>
        <linearGradient id="av-wR" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor={p.wingTip} stopOpacity=".9"/>
          <stop offset="12%" stopColor={p.wingPrimary} stopOpacity=".95"/>
          <stop offset="60%" stopColor={p.wingDeep} stopOpacity=".45"/>
          <stop offset="100%" stopColor={p.atmosphere} stopOpacity=".1"/>
        </linearGradient>
        <linearGradient id="av-robe" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={p.robeLight} stopOpacity=".98"/>
          <stop offset="40%" stopColor={p.robeMid} stopOpacity=".9"/>
          <stop offset="100%" stopColor={p.robeDark} stopOpacity=".5"/>
        </linearGradient>
        <linearGradient id="av-armor" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={p.armorLight}/>
          <stop offset="100%" stopColor={p.armorDark}/>
        </linearGradient>
        <linearGradient id="av-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.accentLight}/>
          <stop offset="50%" stopColor={p.accentMid}/>
          <stop offset="100%" stopColor={p.accentDark}/>
        </linearGradient>
        <radialGradient id="av-hood" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={p.hoodLight}/>
          <stop offset="100%" stopColor={p.hoodDark}/>
        </radialGradient>
        <radialGradient id="av-tip" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.tipGlow} stopOpacity=".8"/>
          <stop offset="100%" stopColor={p.wingPrimary} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="av-mist" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.mist} stopOpacity=".3"/>
          <stop offset="100%" stopColor={p.mist} stopOpacity="0"/>
        </radialGradient>
        <filter id="av-g">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="av-sg">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="av-xg">
          <feGaussianBlur stdDeviation="18" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="av-ds" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="28" floodColor={p.shadow} floodOpacity=".5"/>
        </filter>
      </defs>

      {/* light beam — breathes */}
      <polygon points="375,0 625,0 695,535 305,535" fill={p.beam} opacity=".18">
        <animate attributeName="opacity" values=".12;.25;.12" dur="6s" repeatCount="indefinite"/>
      </polygon>

      {/* main figure — floats */}
      <g filter="url(#av-ds)">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-14;0,0" dur="8s" repeatCount="indefinite" calcMode="ease"/>

        <ellipse cx="500" cy="500" rx="420" ry="340" fill={p.atmosphere} opacity=".65"/>
        <g opacity=".12" fill={p.rays}>
          <polygon points="500,0 420,820 580,820"/>
          <polygon points="500,0 360,820 500,820"/>
          <polygon points="500,0 500,820 640,820"/>
        </g>

        {/* LEFT WING */}
        <ellipse cx="120" cy="200" rx="150" ry="70" fill="url(#av-tip)" opacity=".9" filter="url(#av-xg)"/>
        <path d="M488 360 C460 320,380 270,280 200 C200 145,110 90,30 30 C20 22,8 14,15 8 C24 2,50 18,80 38 C150 80,240 140,330 200 C390 240,440 280,478 330Z" fill="url(#av-wL)" filter="url(#av-g)"/>
        <path d="M490 385 C440 355,330 300,200 230 C120 186,45 148,-15 120 C30 135,110 172,200 218 C320 278,440 340,482 370Z" fill="url(#av-wL)" opacity=".7" filter="url(#av-g)"/>
        <path d="M482 420 C430 408,325 388,205 362 C128 346,58 335,12 332 C55 337,128 352,208 370 C318 396,428 420,478 434Z" fill="url(#av-wL)" opacity=".5"/>
        <g stroke={p.wingVein} strokeWidth=".9" fill="none" opacity=".55" filter="url(#av-g)">
          <path d="M486 352 C430 300,340 228,218 148 C138 98,58 52,8 16"/>
          <path d="M484 365 C428 315,336 244,212 163 C130 112,50 66,2 30"/>
          <path d="M482 378 C426 330,330 260,205 178 C122 126,40 80,-6 44"/>
          <path d="M480 393 C424 347,326 278,200 196 C114 144,32 98,-12 62"/>
          <path d="M479 410 C424 365,324 298,196 216 C108 163,26 116,-16 80"/>
          <path d="M479 428 C425 385,322 318,192 238 C102 183,22 136,-20 100"/>
          <path d="M478 444 C428 430,332 410,216 388 C136 372,66 360,18 356"/>
        </g>

        {/* RIGHT WING */}
        <ellipse cx="880" cy="200" rx="150" ry="70" fill="url(#av-tip)" opacity=".9" filter="url(#av-xg)"/>
        <path d="M512 360 C540 320,620 270,720 200 C800 145,890 90,970 30 C980 22,992 14,985 8 C976 2,950 18,920 38 C850 80,760 140,670 200 C610 240,560 280,522 330Z" fill="url(#av-wR)" filter="url(#av-g)"/>
        <path d="M510 385 C560 355,670 300,800 230 C880 186,955 148,1015 120 C970 135,890 172,800 218 C680 278,560 340,518 370Z" fill="url(#av-wR)" opacity=".7" filter="url(#av-g)"/>
        <path d="M518 420 C570 408,675 388,795 362 C872 346,942 335,988 332 C945 337,872 352,792 370 C682 396,572 420,522 434Z" fill="url(#av-wR)" opacity=".5"/>
        <g stroke={p.wingVein} strokeWidth=".9" fill="none" opacity=".55" filter="url(#av-g)">
          <path d="M514 352 C570 300,660 228,782 148 C862 98,942 52,992 16"/>
          <path d="M516 365 C572 315,664 244,788 163 C870 112,950 66,998 30"/>
          <path d="M518 378 C574 330,670 260,795 178 C878 126,960 80,1006 44"/>
          <path d="M520 393 C576 347,674 278,800 196 C886 144,968 98,1012 62"/>
          <path d="M521 410 C576 365,676 298,804 216 C892 163,974 116,1016 80"/>
          <path d="M521 428 C575 385,678 318,808 238 C898 183,978 136,1020 100"/>
          <path d="M522 444 C572 430,668 410,784 388 C864 372,934 360,982 356"/>
        </g>

        {/* BODY */}
        <path d="M448 395 C438 435,426 495,422 572 C416 632,418 682,422 742L578 742 C582 682,584 632,578 572 C572 495,562 435,552 395Z" fill="url(#av-robe)" opacity=".92" filter="url(#av-g)"/>

        {/* ARMOR */}
        <path d="M448 360 C444 337,448 314,464 302 C476 294,490 298,500 300 C510 298,524 294,536 302 C552 314,556 337,552 360 C544 384,526 402,500 408 C474 402,456 384,448 360Z" fill="url(#av-armor)" opacity=".97" filter="url(#av-g)"/>
        <g stroke={p.armorVein} strokeWidth=".8" fill="none" opacity=".6">
          <path d="M462 344 C468 330,482 322,500 324 C518 322,532 330,538 344"/>
          <line x1="500" y1="302" x2="500" y2="404"/>
        </g>

        {/* CROSS */}
        <rect x="494" y="324" width="12" height="46" rx="2.5" fill="url(#av-accent)" opacity=".95" filter="url(#av-g)"/>
        <rect x="478" y="342" width="44" height="12" rx="2.5" fill="url(#av-accent)" opacity=".95" filter="url(#av-g)"/>

        {/* SHOULDERS */}
        <path d="M436 332 C418 317,414 298,426 287 C438 278,454 288,458 304 C460 318,452 332,436 332Z" fill="url(#av-armor)" opacity=".92" filter="url(#av-g)"/>
        <path d="M564 332 C582 317,586 298,574 287 C562 278,546 288,542 304 C540 318,548 332,564 332Z" fill="url(#av-armor)" opacity=".92" filter="url(#av-g)"/>

        {/* HEAD / HOOD */}
        <ellipse cx="500" cy="268" rx="52" ry="58" fill="url(#av-hood)" filter="url(#av-g)"/>
        <path d="M462 274 C462 248,470 228,500 218 C530 228,538 248,538 274 C536 290,526 302,500 308 C474 302,464 290,462 274Z" fill="#00060e" opacity=".92"/>

        {/* EYES */}
        <ellipse cx="486" cy="272" rx="8" ry="5.5" fill={p.eye} filter="url(#av-sg)" opacity=".95"/>
        <ellipse cx="514" cy="272" rx="8" ry="5.5" fill={p.eye} filter="url(#av-sg)" opacity=".95"/>
        <circle cx="486" cy="272" r="2.5" fill={p.eyeHL}/>
        <circle cx="514" cy="272" r="2.5" fill={p.eyeHL}/>

        {/* HALO */}
        <ellipse cx="500" cy="212" rx="55" ry="12" fill="none" stroke="url(#av-accent)" strokeWidth="3" filter="url(#av-g)" opacity=".9"/>

        {/* GROUND MIST */}
        <ellipse cx="500" cy="742" rx="180" ry="20" fill="url(#av-mist)" filter="url(#av-xg)"/>

        {/* NAME */}
        <text x="500" y="790" textAnchor="middle" fontFamily="Palatino,serif" fontSize="22" fill={p.nameColor} letterSpacing="10" opacity=".9">{p.name}</text>
        <text x="500" y="812" textAnchor="middle" fontFamily="Palatino,serif" fontSize="11" fill={p.subtitleColor} letterSpacing="5" opacity=".65">{p.subtitle}</text>
      </g>
    </svg>
  );
}
