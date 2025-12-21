import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ToolsSection } from "@/components/ToolsSection";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { TechStackSection } from "@/components/TechStackSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ToolsSection />
        <ComingSoonSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
