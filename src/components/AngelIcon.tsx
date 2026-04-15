export default function AngelIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Halo */}
      <ellipse cx="12" cy="4.5" rx="3.5" ry="1.3" />
      {/* Left wing */}
      <path d="M11 9.5C9.5 8.5 7 8 5 10C3.5 11.5 4.5 14 7 13C9 12.3 10.5 11 11 9.5Z" />
      {/* Right wing */}
      <path d="M13 9.5C14.5 8.5 17 8 19 10C20.5 11.5 19.5 14 17 13C15 12.3 13.5 11 13 9.5Z" />
      {/* Body */}
      <path d="M12 9.5L12 19" />
      {/* Arms */}
      <path d="M9.5 15.5C10.5 14.5 13.5 14.5 14.5 15.5" />
    </svg>
  );
}
