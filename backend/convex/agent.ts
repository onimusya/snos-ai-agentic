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
1. **Web Search & Threat Intelligence** (webSearch) - Research suspicious URLs, phone numbers, or entities
2. **URL Security Scanner** (scanUrl) - Analyze links for phishing indicators, check domain reputation
3. **Deepfake Detection Service** (analyzeImage, analyzeVideo, analyzeAudio) - Analyze media for manipulation
4. **Content Analysis** - Built into your reasoning capabilities

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

  // Create agent with custom Azure Foundry AI configuration
  const agent = new Agent({
    id: "snos-ai",
    name: "S.N.O.S. AI",
    instructions: SYSTEM_PROMPT,
    model: {
      // Use Anthropic model ID format
      id: "anthropic/claude-3-5-sonnet-20241022",
      // Custom URL for Azure Foundry AI
      url: process.env.AZURE_FOUNDRY_BASE_URL,
      apiKey: process.env.AZURE_FOUNDRY_API_KEY,
      headers: {
        "anthropic-version": process.env.ANTHROPIC_VERSION || "2023-06-01",
      },
    },
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

    // Build the prompt with message content and attachments
    let userPrompt = message.content;

    // Add attachment information if present
    if (message.attachments && message.attachments.length > 0) {
      userPrompt += "\n\nAttachments provided:";
      for (const storageId of message.attachments) {
        // Get file metadata to determine type
        const metadata = await ctx.runQuery(internal.storage.getFileMetadataInternal, {
          storageId,
        });
        
        if (metadata) {
          const contentType = metadata.contentType || "";
          if (contentType.startsWith("image/")) {
            userPrompt += `\n- Image file (storage ID: ${storageId}) - Use analyzeImage tool to analyze this image`;
          } else if (contentType.startsWith("video/")) {
            userPrompt += `\n- Video file (storage ID: ${storageId}) - Use analyzeVideo tool to analyze this video`;
          } else if (contentType.startsWith("audio/")) {
            userPrompt += `\n- Audio file (storage ID: ${storageId}) - Use analyzeAudio tool to analyze this audio`;
          }
        }
      }
    }

    // Detect URLs in the message content
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.content.match(urlRegex);
    if (urls && urls.length > 0) {
      userPrompt += `\n\nURLs detected in message. Use scanUrl tool to analyze these URLs for threats.`;
    }

    // Build messages array with history and current message
    // Mastra agent.generate() accepts CoreMessage[] format
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...history,
      { role: "user" as const, content: userPrompt },
    ];

    // Generate AI response using Mastra agent
    // Mastra agent.generate() accepts string, string[], or CoreMessage[]
    const response = await agent.generate(messages as any);

    // Calculate risk level and score from the response
    let riskLevel: "high" | "medium" | "low" = "low";
    let riskScore = 0;

    const responseText = response.text.toLowerCase();
    if (responseText.includes("high risk") || responseText.includes("high threat") || responseText.includes("⚠️ high")) {
      riskLevel = "high";
      riskScore = 0.8;
    } else if (responseText.includes("medium risk") || responseText.includes("medium threat") || responseText.includes("⚠️ medium")) {
      riskLevel = "medium";
      riskScore = 0.5;
    } else if (responseText.includes("low risk") || responseText.includes("low threat") || responseText.includes("✅ safe")) {
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

    return null;
  },
});
