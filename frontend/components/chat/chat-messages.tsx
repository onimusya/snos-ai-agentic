"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, MessageSquare, Bot } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { useEffect, useRef } from "react";

// Type for message based on the query return type
type Message = {
  _id: Id<"messages">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  role: "user" | "assistant";
  content: string;
  attachments?: Id<"_storage">[];
  riskLevel?: "high" | "medium" | "low";
  riskScore?: number;
  toolCalls?: Array<{
    tool: string;
    input: any;
    output: any;
  }>;
};

interface ChatMessagesProps {
  conversationId: Id<"conversations"> | null;
}

export function ChatMessages({ conversationId }: ChatMessagesProps) {
  const messages = useQuery(
    api.messages.list,
    conversationId ? { conversationId } : "skip"
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or when AI starts thinking
  useEffect(() => {
    if (messages && scrollContainerRef.current) {
      // Scroll to bottom after a short delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div className="max-w-md">
          <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Select a conversation from the sidebar or create a new chat to get
            started.
          </p>
        </div>
      </div>
    );
  }

  if (messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div className="max-w-md">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-sm text-muted-foreground">
            Start the conversation by sending a message below.
          </p>
        </div>
      </div>
    );
  }

  // Check if the last message is from user (AI is thinking)
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isAIThinking = lastMessage?.role === "user";

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden"
    >
      <div className="p-4 space-y-4">
        {messages.map((message: Message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isUser={message.role === "user"}
          />
        ))}
        {/* Show thinking animation when AI is processing */}
        {isAIThinking && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <div className="rounded-lg px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-white border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
