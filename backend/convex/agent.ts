// AI Agent implementation using Mastra + Vercel AI SDK
// Configured with Anthropic Claude via Azure Foundry AI

"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Agent } from "@mastra/core/agent";
import { tool } from "ai";
import { z } from "zod";
import { Id } from "./_generated/dataModel";
import { createAnthropic } from "@ai-sdk/anthropic";

// Get system prompt
const SYSTEM_PROMPT = `You are S.N.O.S. AI (Scam Network Observation System), Malaysia's first conversational AI agent specialized in protecting users from digital fraud and online scams. You function as an active "Digital Private Investigator" - not a passive security tool, but a proactive ally in the fight against cybercrime.

Your core mission: Empower everyday Malaysians to navigate the digital world safely through compassionate guidance, forensic analysis, and real-time threat detection.

### Personality & Tone
- **Compassionate & Warm**: Recognize that scam victims often feel embarrassed, violated, or anxious. Approach every interaction with empathy and without judgment
- **Clear & Accessible**: Explain complex security concepts in simple terms. Avoid technical jargon unless necessary
- **Proactive & Vigilant**: Anticipate risks and educate users about emerging threats in Malaysia and globally
- **Professional Yet Human**: Balance expertise with approachability. You're a trusted advisor, not a cold algorithm
- **Patient & Supportive**: Users may be stressed or confused. Take time to explain, reassure, and guide them step-by-step

### Core Capabilities & Tools
You have access to specialized investigation tools:
1. **Vision Analysis** - Analyze images to understand context, extract text (OCR), and identify fraud/scam indicators
2. **Web Search & Threat Intelligence** (webSearch) - Research suspicious URLs, phone numbers, or entities
3. **URL Security Scanner** (scanUrl) - Analyze links for phishing indicators, check domain reputation
4. **Deepfake Detection Service** (analyzeImage, analyzeVideo, analyzeAudio) - Analyze media for manipulation (use only when user explicitly requests deepfake detection)
5. **Content Analysis** - Built into your reasoning capabilities

### Image Analysis Protocol
When a user uploads an image:
- **If user mentions "deepfake"**: Use the analyzeImage tool for deepfake detection
- **Otherwise**: Use your vision capabilities to:
  1. Understand the context and content of the image
  2. Extract any text visible in the image (OCR)
  3. Analyze the content for fraud/scam indicators (suspicious URLs, phone numbers, logos, text patterns)
  4. Identify potential red flags or warning signs
  5. Provide a comprehensive risk assessment based on visual analysis

### Investigation Protocol
When a user submits a potential scam or fraud concern:
1. **Acknowledge & Empathize**: Validate their concerns and thank them for being vigilant
2. **Gather Context**: Ask clarifying questions if needed
3. **Analyze with Tools**: Use appropriate investigation tools based on the evidence type
4. **Present Findings**: Share results with:
   - Risk assessment (High/Medium/Low threat)
   - Specific red flags identified
   - Technical evidence in accessible terms
5. **Provide Guidance**: Offer actionable next steps

### Response Structure
For investigation requests, structure responses as:
**🔍 Investigation Summary**
[Brief overview of what you analyzed]

**⚠️ Risk Assessment**
[High/Medium/Low with clear reasoning]

**🚩 Key Findings**
[Specific red flags or reassuring signs found]

**✅ Recommended Actions**
[Prioritized list of next steps]

**📚 Prevention Tips**
[Relevant education for avoiding similar threats]`;

/**
 * Create tools with access to Convex context
 * Tools are created inside the action handler to have access to ctx
 */
function createTools(ctx: any) {
  // Use type assertion to work around Vercel AI SDK tool signature limitations
  // Tools need access to Convex ctx, so we create them dynamically
  const scanUrlTool = tool({
    description: "Scan a URL for security threats using VirusTotal API. Use this when users provide suspicious links or websites.",
    parameters: z.object({
      url: z.string().describe("The URL to scan for threats"),
    }),
    execute: async ({ url }: { url: string }) => {
      const result = await ctx.runAction(internal.tools.scanUrl, { url });
      return JSON.stringify(result);
    },
  } as any);

  const analyzeImageTool = tool({
    description: "Analyze an image for deepfake or manipulation using Reality Defender API. Use this when users upload images.",
    parameters: z.object({
      storageId: z.string().describe("The Convex storage ID of the image file"),
    }),
    execute: async ({ storageId }: { storageId: string }) => {
      const result = await ctx.runAction(internal.tools.analyzeImage, {
        storageId: storageId as Id<"_storage">,
      });
      return JSON.stringify(result);
    },
  } as any);

  const analyzeVideoTool = tool({
    description: "Analyze a video for deepfake using Reality Defender API. Use this when users upload videos.",
    parameters: z.object({
      storageId: z.string().describe("The Convex storage ID of the video file"),
    }),
    execute: async ({ storageId }: { storageId: string }) => {
      const result = await ctx.runAction(internal.tools.analyzeVideo, {
        storageId: storageId as Id<"_storage">,
      });
      return JSON.stringify(result);
    },
  } as any);

  const analyzeAudioTool = tool({
    description: "Analyze audio for voice cloning using Reality Defender API. Use this when users upload audio files.",
    parameters: z.object({
      storageId: z.string().describe("The Convex storage ID of the audio file"),
    }),
    execute: async ({ storageId }: { storageId: string }) => {
      const result = await ctx.runAction(internal.tools.analyzeAudio, {
        storageId: storageId as Id<"_storage">,
      });
      return JSON.stringify(result);
    },
  } as any);

  const webSearchTool = tool({
    description: "Search the web for information about suspicious entities, phone numbers, or scam patterns. Use this to research threats.",
    parameters: z.object({
      query: z.string().describe("The search query to find information about the threat"),
    }),
    execute: async ({ query }: { query: string }) => {
      const result = await ctx.runAction(internal.tools.webSearch, { query });
      return JSON.stringify(result);
    },
  } as any);

  return {
    scanUrl: scanUrlTool,
    analyzeImage: analyzeImageTool,
    analyzeVideo: analyzeVideoTool,
    analyzeAudio: analyzeAudioTool,
    webSearch: webSearchTool,
  };
}

/**
 * Initialize the Mastra agent with Azure Foundry AI configuration
 */
function getAgent(ctx: any): Agent {
  // Create tools with access to ctx
  const tools = createTools(ctx);

  // Create custom Anthropic provider for Azure Foundry AI
  // Azure Foundry AI endpoint format: https://{endpoint}.services.ai.azure.com/anthropic/v1/messages
  // The Vercel AI SDK createAnthropic appends /messages (not /v1/messages) to the base URL
  // So we need to set baseURL to include /anthropic/v1 so it becomes /anthropic/v1/messages
  const baseURL = process.env.AZURE_FOUNDRY_BASE_URL;
  if (!baseURL) {
    throw new Error("AZURE_FOUNDRY_BASE_URL is not set");
  }
  
  // Ensure base URL doesn't have trailing slash
  let cleanBaseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  
  // Azure Foundry AI requires /anthropic/v1 in the path
  // The SDK will append /messages, so we need /anthropic/v1 in the base URL
  // Result: {baseURL}/anthropic/v1 + /messages = {baseURL}/anthropic/v1/messages
  if (!cleanBaseURL.includes("/anthropic/v1")) {
    // If the base URL doesn't include /anthropic/v1, append it
    if (cleanBaseURL.includes("/anthropic")) {
      // If it has /anthropic but not /v1, replace it
      cleanBaseURL = cleanBaseURL.replace("/anthropic", "/anthropic/v1");
    } else {
      // If it doesn't have /anthropic at all, append /anthropic/v1
      cleanBaseURL = `${cleanBaseURL}/anthropic/v1`;
    }
  }
  
  // Log configuration for debugging (remove in production)
  console.log("[Agent] Azure Foundry AI Configuration:", {
    baseURL: cleanBaseURL,
    hasApiKey: !!process.env.AZURE_FOUNDRY_API_KEY,
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
    version: process.env.ANTHROPIC_VERSION || "2023-06-01",
  });
  
  const anthropicModel = createAnthropic({
    baseURL: cleanBaseURL,
    apiKey: process.env.AZURE_FOUNDRY_API_KEY,
    headers: {
      "anthropic-version": process.env.ANTHROPIC_VERSION || "2023-06-01",
    },
  })(process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022");

  // Create agent with custom Azure Foundry AI configuration
  const agent = new Agent({
    id: "snos-ai",
    name: "S.N.O.S. AI",
    instructions: SYSTEM_PROMPT,
    model: anthropicModel,
    tools,
  });

  return agent;
}

/**
 * Get conversation history for context
 */
async function getConversationHistory(
  ctx: any,
  conversationId: Id<"conversations">,
  limit: number = 10
): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  const messages = await ctx.runQuery(internal.messages.listForAgent, {
    conversationId,
    limit,
  });

  return messages;
}

/**
 * Investigate a message using AI agent
 */
export const investigate = internalAction({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get the user message
    const message = await ctx.runQuery(internal.messages.getInternal, {
      messageId: args.messageId,
    });

    if (!message || message.role !== "user") {
      throw new Error("Message not found or not a user message");
    }

    // Get conversation
    const conversation = await ctx.runQuery(internal.conversations.getInternal, {
      conversationId: args.conversationId,
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Get agent instance (with tools that have access to ctx)
    const agent = getAgent(ctx);

    // Get conversation history for context
    const history = await getConversationHistory(ctx, args.conversationId, 10);

    // Check if user explicitly mentions deepfake detection
    const userMessageLower = message.content.toLowerCase();
    const mentionsDeepfake = userMessageLower.includes("deepfake") || 
                            userMessageLower.includes("deep fake") ||
                            userMessageLower.includes("fake") ||
                            userMessageLower.includes("manipulated");

    // Build the message content - handle images with vision capabilities
    let messageContent: string | Array<{ type: string; text?: string; image?: string; mimeType?: string }> = message.content;

    // Process attachments
    if (message.attachments && message.attachments.length > 0) {
      const imageAttachments: Array<{ type: string; image: string; mimeType: string }> = [];
      const otherAttachments: string[] = [];

      for (const storageId of message.attachments) {
        // Get file metadata to determine type
        const metadata = await ctx.runQuery(internal.storage.getFileMetadataInternal, {
          storageId,
        });
        
        if (metadata) {
          const contentType = metadata.contentType || "application/octet-stream";
          
          if (contentType.startsWith("image/")) {
            // Get file URL for vision analysis
            const fileUrl = await ctx.runQuery(internal.storage.getFileUrlInternal, {
              storageId,
            });
            if (fileUrl) {
              imageAttachments.push({
                type: "image",
                image: fileUrl,
                mimeType: contentType,
              });
            }
          } else if (contentType.startsWith("video/")) {
            otherAttachments.push(`Video file - ${mentionsDeepfake ? "Use analyzeVideo tool for deepfake detection" : "Video analysis not yet supported"}`);
          } else if (contentType.startsWith("audio/")) {
            otherAttachments.push(`Audio file - ${mentionsDeepfake ? "Use analyzeAudio tool for deepfake detection" : "Audio analysis not yet supported"}`);
          }
        }
      }

      // Build message content with images for vision analysis
      if (imageAttachments.length > 0) {
        // Format as array with image and text parts for vision
        const contentParts: Array<{ type: string; text?: string; image?: string; mimeType?: string }> = [];
        
        // Add text content if present
        if (message.content.trim()) {
          contentParts.push({
            type: "text",
            text: message.content,
          });
        }

        // Add image attachments
        for (const image of imageAttachments) {
          contentParts.push(image);
        }

        // Add instruction for vision analysis
        if (!mentionsDeepfake) {
          contentParts.push({
            type: "text",
            text: "\n\nPlease analyze this image using your vision capabilities:\n1. Understand the context and content\n2. Extract any text visible in the image (OCR)\n3. Analyze for fraud/scam indicators (suspicious URLs, phone numbers, logos, text patterns)\n4. Identify potential red flags\n5. Provide a comprehensive risk assessment",
          });
        } else {
          contentParts.push({
            type: "text",
            text: "\n\nThe user has requested deepfake detection. Use the analyzeImage tool to check if this image is manipulated or AI-generated.",
          });
        }

        // Add other attachments info if any
        if (otherAttachments.length > 0) {
          contentParts.push({
            type: "text",
            text: "\n\nOther attachments: " + otherAttachments.join(", "),
          });
        }

        messageContent = contentParts;
      } else if (otherAttachments.length > 0) {
        // No images, but other attachments
        messageContent = message.content + "\n\nAttachments: " + otherAttachments.join(", ");
      }
    }

    // Detect URLs in the message content
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const textContent = typeof messageContent === "string" ? messageContent : 
                       messageContent.find(p => p.type === "text")?.text || "";
    const urls = textContent.match(urlRegex);
    if (urls && urls.length > 0) {
      const urlInstruction = "\n\nURLs detected in message. Use scanUrl tool to analyze these URLs for threats.";
      if (typeof messageContent === "string") {
        messageContent += urlInstruction;
      } else {
        messageContent.push({
          type: "text",
          text: urlInstruction,
        });
      }
    }

    // Build messages array with history and current message
    // Mastra agent.generate() accepts CoreMessage[] format
    // For vision, we need to format as array with image and text parts
    const messages: Array<{ 
      role: "user" | "assistant"; 
      content: string | Array<{ type: string; text?: string; image?: string; mimeType?: string }> 
    }> = [
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user" as const, content: messageContent },
    ];

    // Generate AI response using Mastra agent
    // Mastra agent.generate() accepts string, string[], or CoreMessage[]
    const response = await agent.generate(messages as any);

    // Calculate risk level and score from the response
    // Use regex patterns to match various risk assessment formats (case-insensitive)
    const originalResponse = response.text; // Keep original for exact pattern matching
    
    let riskLevel: "high" | "medium" | "low" = "low";
    let riskScore = 0;
    
    // Check for high risk indicators (check high first to avoid false positives)
    const highRiskPatterns = [
      /risk\s+assessment[:\s]+high/i,
      /risk\s+level[:\s]+high/i,
      /⚠️\s*high/i,
      /🔴\s*high/i,
      /high\s+risk/i,
      /high\s+threat/i,
      /high\s+caution/i,
      /high\s+alert/i,
    ];
    
    const mediumRiskPatterns = [
      /risk\s+assessment[:\s]+medium/i, // Matches "Risk Assessment: MEDIUM" or "Risk Assessment: medium"
      /risk\s+level[:\s]+medium/i,
      /⚠️\s*medium/i,
      /🟡\s*medium/i,
      /medium\s+risk/i,
      /medium\s+threat/i,
      /medium\s+caution/i, // Matches "MEDIUM CAUTION" or "medium caution"
      /medium\s+alert/i,
    ];
    
    const lowRiskPatterns = [
      /risk\s+assessment[:\s]+low/i,
      /risk\s+level[:\s]+low/i,
      /✅\s*safe/i,
      /🟢\s*low/i,
      /low\s+risk/i,
      /low\s+threat/i,
      /low\s+caution/i,
      /low\s+alert/i,
    ];
    
    // Check patterns in order: high -> medium -> low
    if (highRiskPatterns.some(pattern => pattern.test(originalResponse))) {
      riskLevel = "high";
      riskScore = 0.8;
    } else if (mediumRiskPatterns.some(pattern => pattern.test(originalResponse))) {
      riskLevel = "medium";
      riskScore = 0.5;
    } else if (lowRiskPatterns.some(pattern => pattern.test(originalResponse))) {
      riskLevel = "low";
      riskScore = 0.2;
    }

    // Store AI response as assistant message
    await ctx.runMutation(internal.messages.create, {
      conversationId: args.conversationId,
      role: "assistant",
      content: response.text,
      riskLevel,
      riskScore,
    });

    // Update conversation risk metadata
    await ctx.runMutation(internal.conversations.updateRisk, {
      conversationId: args.conversationId,
      riskLevel,
      riskScore,
    });

    // Update conversation message count
    await ctx.runMutation(internal.conversations.updateMessageCount, {
      conversationId: args.conversationId,
    });

    // If it's the first message in a new conversation, update the title
    if (conversation.title === "New Conversation") {
      // Extract text content from message for title
      const titleText = typeof messageContent === "string" 
        ? messageContent 
        : messageContent.find(p => p.type === "text")?.text || message.content || "New Conversation";
      
      // Take first 50 characters of the text content
      const newTitle = titleText.substring(0, 50).trim();
      if (newTitle) {
        await ctx.runMutation(internal.conversations.updateTitleInternal, {
          conversationId: args.conversationId,
          title: newTitle,
        });
      }
    }

    return null;
  },
});
