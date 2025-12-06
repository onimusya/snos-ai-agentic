"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Menu, Flag } from "lucide-react";

interface ChatHeaderProps {
  conversationId: Id<"conversations"> | null;
  onMenuClick?: () => void;
  onReportClick?: () => void;
  showMenuButton?: boolean;
}

export function ChatHeader({
  conversationId,
  onMenuClick,
  onReportClick,
  showMenuButton = false,
}: ChatHeaderProps) {
  const conversation = useQuery(
    api.conversations.get,
    conversationId ? { conversationId } : "skip"
  );

  const title = conversation?.title || "New Conversation";

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h2 className="text-lg font-semibold truncate">{title}</h2>
      </div>
      {onReportClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReportClick}
          className="rounded-full"
        >
          <Flag className="h-4 w-4 mr-2" />
          Make Report
        </Button>
      )}
    </div>
  );
}

