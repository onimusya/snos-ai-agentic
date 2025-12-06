"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Bot, Image, Video, Music, File, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: {
    _id: Id<"messages">;
    _creationTime: number;
    role: "user" | "assistant";
    content: string;
    attachments?: Id<"_storage">[];
    riskLevel?: "high" | "medium" | "low";
  };
  isUser: boolean;
}

function AttachmentPreview({ storageId }: { storageId: Id<"_storage"> }) {
  const fileUrl = useQuery(api.storage.getFileUrl, { storageId });
  const fileMetadata = useQuery(api.storage.getFileMetadata, { storageId });

  if (!fileUrl || !fileMetadata) {
    return (
      <div className="p-2 bg-muted rounded-md flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const contentType = fileMetadata.contentType || "";
  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");
  const isAudio = contentType.startsWith("audio/");

  if (isImage) {
    return (
      <div className="mt-2 rounded-md overflow-hidden max-w-sm">
        <img
          src={fileUrl}
          alt="Attachment"
          className="max-w-full h-auto rounded-md"
        />
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="mt-2 rounded-md overflow-hidden max-w-sm">
        <video
          src={fileUrl}
          controls
          className="max-w-full h-auto rounded-md"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="mt-2 p-3 bg-muted rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Music className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Audio file</span>
        </div>
        <audio src={fileUrl} controls className="w-full">
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  return (
    <div className="mt-2 p-3 bg-muted rounded-md flex items-center gap-2">
      <File className="h-4 w-4 text-muted-foreground" />
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-foreground hover:underline"
      >
        Download file
      </a>
    </div>
  );
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex flex-col gap-1 max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`
            rounded-lg px-4 py-2
            ${
              isUser
                ? "bg-foreground text-background"
                : "bg-muted text-foreground"
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((storageId) => (
                <AttachmentPreview key={storageId} storageId={storageId} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {format(new Date(message._creationTime), "HH:mm")}
          </span>
          {message.riskLevel && (
            <>
              <span>•</span>
              <Badge
                variant={
                  message.riskLevel === "high"
                    ? "destructive"
                    : message.riskLevel === "medium"
                    ? "default"
                    : "secondary"
                }
                className="text-xs px-1.5 py-0"
              >
                {message.riskLevel}
              </Badge>
            </>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-muted">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

