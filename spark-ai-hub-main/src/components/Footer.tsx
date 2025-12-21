import { Link, useLocation } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-border bg-background py-12">
      <div className="absolute inset-0 bg-noise" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center text-center">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 mb-4 group hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold">
              <span className="text-foreground">SP</span>
              <span className="text-primary">A</span>
              <span className="text-foreground">RK</span>
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            Smart Personal Assistant for Real-time Knowledge.
            <br />
            Igniting intelligence. Powering decisions.
          </p>

          {/* Navigation placeholders */}
          <div className="flex gap-8 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/#tools" className="hover:text-primary transition-colors">
              Tools
            </Link>
            <Link to="/#contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Built with love */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
            <span>using AI</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/50 mt-4">
            © {new Date().getFullYear()} SPARK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
