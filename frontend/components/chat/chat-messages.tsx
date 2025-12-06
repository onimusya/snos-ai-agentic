"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquare, Bot } from "lucide-react";
import { MessageBubble } from "./message-bubble";

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

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {messages.map((message: Message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isUser={message.role === "user"}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
