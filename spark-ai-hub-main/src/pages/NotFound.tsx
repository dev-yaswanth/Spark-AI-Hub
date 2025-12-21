import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center animate-fade-up px-4">
        <h1 className="mb-6 text-7xl md:text-9xl font-bold tracking-tight">
          <span className="text-foreground">4</span>
          <span className="text-primary glow-text">0</span>
          <span className="text-foreground">4</span>
        </h1>
        <p className="mb-8 text-xl md:text-2xl text-muted-foreground max-w-md mx-auto">
          Oops! It seems you've wandered into a digital void. This page doesn't exist.
        </p>
        <Button variant="hero" size="lg" asChild>
          <a href="/">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
