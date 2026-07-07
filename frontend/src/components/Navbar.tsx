import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

const navigation = [
  { name: "How it Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "Security", href: "#security" },
  { name: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  return (
    <header className={`fixed left-1/2 -translate-x-1/2 z-50 flex justify-center items-center transition-all duration-300 ${isSticky ? "bg-white top-0 w-full px-6 md:px-12 py-2" : "top-10 w-[90%] md:w-2/3 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-[0px_16px_24px_2px_#00000024] rounded-2xl py-1" }`}>
      <div className="w-full mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logos/vouch-logo.png"
            alt="Vouch Logo"
            width={100}
            height={100}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-sm font-medium text-primary">
            Login
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm">
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={handleToggle}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-4 flex flex-col gap-4 shadow-lg absolute w-full mt-100">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-foreground py-2 border-b border-border/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-foreground py-2 border-b border-border/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#security"
            className="text-sm font-medium text-foreground py-2 border-b border-border/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Security
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-foreground py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            FAQ
          </a>
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="outline" className="w-full justify-center">
              Login
            </Button>
            <Button className="w-full justify-center bg-primary text-white">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
