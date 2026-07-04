import Image from "next/image"

export function Header() {
  return (
    <div className="w-full bg-secondary py-6 px-4 flex flex-col items-center justify-center space-y-2 border-b">
      <div className="flex items-center gap-2">
        {/* We can fallback to icon if logo doesn't load, but we'll try the logo first */}
        <div className="h-7 w-7 text-primary shrink-0 flex items-center justify-center">
          <Image src={"/logos/vouch-logo.png"} alt="Vouch Logo" className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">Vouch</span>
      </div>
      <p className="text-sm text-foreground/80 font-medium text-center">
        A trusted payment layer for social commerce.
      </p>
    </div>
  );
}
