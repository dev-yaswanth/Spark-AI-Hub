import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 group cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary transition-all group-hover:scale-110 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-foreground">SP</span>
            <span className="text-primary">A</span>
            <span className="text-foreground">RK</span>
          </span>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </a>
          <a
            href="/#tools"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tools
          </a>
          <a
            href="/#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="hidden sm:flex" asChild>
            <a href="/#tools">Get Started</a>
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-border/50">
                <div className="flex flex-col gap-8 mt-12">
                  <Link
                    to="/"
                    onClick={(e) => {
                      handleLogoClick(e);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 mb-8"
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-xl font-bold">SPARK</span>
                  </Link>
                  <a
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </a>
                  <Link
                    to="/#tools"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    Tools
                  </Link>
                  <Link
                    to="/#contact"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                  <Button variant="hero" asChild className="mt-4">
                    <a href="/#tools" onClick={() => setIsOpen(false)}>Get Started</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
