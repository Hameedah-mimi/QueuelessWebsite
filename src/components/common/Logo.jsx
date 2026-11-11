import { Link } from "react-router-dom";

export default function Logo({ className = "h-8", showText = true, to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      {/* Exact SVG rendering of the QueueLess Teal Emblem */}
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} w-auto transition-transform group-hover:scale-105 duration-200`}
      >
        <defs>
          <linearGradient id="ql-teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B4F6C" />
            <stop offset="50%" stopColor="#16A6A1" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>

        {/* Double-arrow / forward fast-track symbol */}
        <path
          d="M12 16 L24 30 L12 44"
          stroke="url(#ql-teal-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 16 L36 30 L24 44"
          stroke="url(#ql-teal-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Circular Queue loop / Q body */}
        <circle
          cx="62"
          cy="28"
          r="18"
          stroke="url(#ql-teal-grad)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Stylized loop tail */}
        <path
          d="M52 38 C56 46, 68 48, 76 38 C80 32, 74 24, 62 30"
          stroke="url(#ql-teal-grad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className="font-black text-xl text-slate-900 tracking-tight flex items-center">
          Queue<span className="text-teal-600">Less</span>
        </span>
      )}
    </Link>
  );
}
