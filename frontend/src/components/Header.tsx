import Image from "next/image"

export function Header() {
  return (
    <div className="w-full bg-[#EFEDFE] py-6 px-4 flex flex-col items-center justify-center space-y-2 border-b">
      <div className="flex items-center gap-2">
        {/* We can fallback to icon if logo doesn't load, but we'll try the logo first */}
        <Image src={"/logos/vouch-logo.png"} alt="Vouch Logo" width={120} height={120} />
      </div>
      <p className="text-sm text-[#565656] font-normal text-center">
        A trusted payment layer for social commerce.
      </p>
    </div>
  );
}
