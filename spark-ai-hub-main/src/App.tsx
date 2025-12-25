import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatBotPage from "./pages/tools/ChatBot";
import ResumeReviewerPage from "./pages/tools/ResumeReviewer";
import ImageClassifierPage from "./pages/tools/ImageClassifier";
import KnowledgeAssistantPage from "./pages/tools/KnowledgeAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools/chatbot" element={<ChatBotPage />} />
          <Route path="/tools/resume-reviewer" element={<ResumeReviewerPage />} />
          <Route path="/tools/image-classifier" element={<ImageClassifierPage />} />
          <Route path="/tools/knowledge-assistant" element={<KnowledgeAssistantPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
