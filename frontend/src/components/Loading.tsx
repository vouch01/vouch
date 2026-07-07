import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          className="absolute"
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="hsl(var(--secondary))"
            strokeWidth="4"
          />
        </svg>

        <svg
          className="absolute animate-spin"
          style={{
            animationDuration: "1.1s",
            animationTimingFunction: "linear",
          }}
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="276.46"
            strokeDashoffset="207.35"
          />
        </svg>

        <div className="flex flex-col items-center justify-center gap-1 z-20">
          <Image
            src={"/images/vouch.png"}
            alt="Vouch"
            width={48}
            height={48}
          />
        </div>
      </div>
    </div>
  );
}
