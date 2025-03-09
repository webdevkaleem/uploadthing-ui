"use client";

// Types
interface Props {
  strokeWidth?: number;
  sqSize?: number;
  percentage: number;
}

// Components
export default function CircularProgressBar(props: Props) {
  // [1] Calculations
  const { strokeWidth = 8, sqSize = 160, percentage } = props;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100;
  const statusMessage = `${percentage}`;

  // [2] JSX
  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className="fill-none stroke-gray-200"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
      />

      <circle
        className="fill-none stroke-primary transition-all delay-200 ease-in"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeLinecap="round"
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,

          strokeDashoffset: dashOffset,
        }}
      />

      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="text-xs font-semibold text-primary fill-primary"
      >
        {statusMessage}
      </text>
    </svg>
  );
}
