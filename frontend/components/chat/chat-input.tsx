"use client";

import { useState, useRef, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatInputProps {
  conversationId: Id<"conversations"> | null;
  onMessageSent?: () => void;
}

// Component for individual attachment preview
function AttachmentPreview({
  file,
  index,
  uploadProgress,
  isSending,
  onRemove,
}: {
  file: File;
  index: number;
  uploadProgress: number | undefined;
  isSending: boolean;
  onRemove: () => void;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith("image/");

  // Create thumbnail URL for images
  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  if (isImage && thumbnailUrl) {
    return (
      <div className="relative group rounded-md overflow-hidden border border-border">
        <img
          src={thumbnailUrl}
          alt={file.name}
          className="h-20 w-20 object-cover"
        />
        {uploadProgress !== undefined && uploadProgress < 100 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-xs text-white">
              {Math.round(uploadProgress)}%
            </span>
          </div>
        )}
        {!isSending && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="h-3 w-3 text-white" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-2 pr-1"
    >
      <span className="text-xs truncate max-w-[150px]">
        {file.name}
        {uploadProgress !== undefined && uploadProgress < 100 && (
          <span className="ml-1 text-muted-foreground">
            ({Math.round(uploadProgress)}%)
          </span>
        )}
      </span>
      {!isSending && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 rounded-full"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  );
}

export function ChatInput({ conversationId, onMessageSent }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useAction(api.messages.send);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const uploadFile = async (file: File, index: number): Promise<Id<"_storage">> => {
    // Get upload URL
    const uploadUrl = await generateUploadUrl();
    setUploadProgress((prev) => ({ ...prev, [index]: 25 }));

    // Upload file to Convex Storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Failed to upload file: ${result.statusText}`);
    }

    // The response contains the storage ID
    const response = await result.json();
    const storageId = response.storageId as Id<"_storage">;
    
    setUploadProgress((prev) => ({ ...prev, [index]: 100 }));
    
    return storageId;
  };

  const handleSend = async () => {
    if (!conversationId || (!message.trim() && attachments.length === 0) || isSending) return;

    setIsSending(true);
    try {
      // Upload all attachments
      const attachmentIds: Id<"_storage">[] = [];
      
      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i];
        try {
          setUploadProgress((prev) => ({ ...prev, [i]: 50 }));
          const storageId = await uploadFile(file, i);
          attachmentIds.push(storageId);
        } catch (error) {
          console.error(`Failed to upload file ${file.name}:`, error);
          alert(`Failed to upload ${file.name}. Please try again.`);
          setIsSending(false);
          setUploadProgress({});
          return;
        }
      }

      await sendMessage({
        conversationId,
        content: message.trim() || "(No text message)",
        attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
      });

      setMessage("");
      setAttachments([]);
      setUploadProgress({});
      onMessageSent?.();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
      setUploadProgress({});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });
    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileType = (file: File): "image" | "audio" | "video" | "other" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.startsWith("video/")) return "video";
    return "other";
  };

  if (!conversationId) {
    return null;
  }

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <AttachmentPreview
              key={index}
              file={file}
              index={index}
              uploadProgress={uploadProgress[index]}
              isSending={isSending}
              onRemove={() => removeAttachment(index)}
            />
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[60px] max-h-[200px] resize-none rounded-lg"
          disabled={isSending}
        />
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || isSending}
          className="rounded-full flex-shrink-0"
          size="icon"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

