"use client";

// Components
export default function CircularProgressBar({
  percentage,
}: {
  percentage: number;
}) {
  // [1] JSX
  return (
    <div className="relative">
      <svg
        className="-rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-primary stroke-2"
        ></circle>
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-secondary stroke-2"
          strokeDasharray="100"
          strokeDashoffset={percentage}
          strokeLinecap="round"
        ></circle>
      </svg>
      <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span className="text-center text-xs font-semibold text-primary">
          {percentage}
        </span>
      </div>
    </div>
  );
}
