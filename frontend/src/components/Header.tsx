import Image from "next/image"

export function Header() {
  return (
    <div className="w-full bg-secondary py-6 px-4 flex flex-col items-center justify-center space-y-2 border-b">
      <div className="flex items-center gap-2">
        {/* We can fallback to icon if logo doesn't load, but we'll try the logo first */}
        <Image src={"/logos/vouch-logo.png"} alt="Vouch Logo" width={100} height={100} />
      </div>
      <p className="text-sm text-foreground/80 font-medium text-center">
        A trusted payment layer for social commerce.
      </p>
    </div>
  );
}
