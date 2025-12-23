import { ToolPageLayout } from "@/components/ToolPageLayout";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (force = false) => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        if (force) {
          viewport.scrollTop = viewport.scrollHeight;
        } else {
          const { scrollTop, scrollHeight, clientHeight } = viewport;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
          if (isAtBottom) {
            viewport.scrollTop = viewport.scrollHeight;
          }
        }
      }
    }
  };

  useEffect(() => {
    // Only auto-scroll if the user is already at the bottom
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat state
    const currentMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: currentMessages }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      const isQuotaError = errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429");

      toast({
        title: isQuotaError ? "API Limit Reached" : "Error",
        description: isQuotaError
          ? "The free tier of Gemini has a temporary rate limit. Please wait a few seconds and try again."
          : "Make sure the backend server is running and try again.",
        variant: "destructive",
      });

      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isQuotaError
          ? "I've reached my temporary rate limit (free tier). Please wait a moment and then try asking again!"
          : "Sorry, I'm having trouble connecting to the server. Please check if the backend is running."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ToolPageLayout
      icon={MessageSquare}
      title="AI Chat Assistant"
      description="Your friendly AI buddy for quick answers, coding help, and interesting conversations."
      longDescription="S.P.A.R.K. is a smart conversational assistant designed to help you with anything. Whether you need a bug fixed in your code, help writing an email, or just want to know about current events, S.P.A.R.K. is ready to help 24/7 with a friendly personality."
      features={[
        "Quick, real-time answers",
        "Smart coding and debugging help",
        "Friendly and helpful persona",
        "Remembers your conversation context",
        "Web search for latest information",
        "Very easy to use",
      ]}
      status="live"
    >
      <div className="mt-8">
        <Card className="h-[700px] flex flex-col shadow-xl gradient-border">
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
            <ScrollArea className="h-full w-full" ref={scrollRef}>
              <div className="p-4 md:p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                        }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {message.role === 'user' ? 'Buddy' : 'S.P.A.R.K.'}
                      </div>
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
                      <div className="text-xs font-semibold mb-1 opacity-70">S.P.A.R.K.</div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
