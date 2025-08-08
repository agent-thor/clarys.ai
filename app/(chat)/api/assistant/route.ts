import { AssistantResponse } from "ai";
import OpenAI, { APIError } from "openai";
import axios from "axios";
import type { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs.mjs";
import { getChatById, getMessagesByChatId, saveChat, saveMessages } from "@/lib/db/queries";
import { generateTitleFromUserMessage } from "@/app/(chat)/actions";
import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Allow streaming responses up to 300 seconds
export const maxDuration = 300;

const blocksTools = ["createDocument", "updateDocument", "requestSuggestions"];
const dateTools = ["getCurrentDateAndTime"];
const postTools = ["processPrompt"]; // Updated to use new prompt-based API
const allTools = [...blocksTools, ...dateTools, ...postTools];

const getCurrentDateAndTime = () => {
  const currentDate = new Date();
  return { currentDate: currentDate.toUTCString() };
};

// COMMENTED OUT - Using new prompt-based API instead
// const getProposalsCountAndProposalsNames = async () => {
//   // This function is no longer used - replaced with processPrompt function
// };

// COMMENTED OUT - Using new prompt-based API instead
// const retrieveData = async (params: any) => {
//   // This function is no longer used - replaced with processPrompt function
// };

const processPrompt = async (prompt: string) => {
  try {
    const newBackendApi = process.env.NEW_BACKEND_API;
    
    if (!newBackendApi) {
      throw new Error("NEW_BACKEND_API environment variable is not set");
    }
    
    const apiUrl = `${newBackendApi}/extract-with-proposals`;
    
    console.log("🔍 [PROCESS_PROMPT] Sending prompt to new backend API:", apiUrl);
    console.log("🔍 [PROCESS_PROMPT] Prompt:", prompt);
    
    const response = await axios.post(apiUrl, {
      prompt: prompt
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("📥 [PROCESS_PROMPT] Response status:", response.status);
    console.log("📥 [PROCESS_PROMPT] Response headers:", JSON.stringify(response.headers, null, 2));
    console.log("📥 [PROCESS_PROMPT] Response data:", JSON.stringify(response.data, null, 2));

    // Expected response format:
    // {
    //   "ids": ["string"],
    //   "links": ["string"], 
    //   "proposals": [ProposalInfo],
    //   "analysis": "string | null"
    // }

    if (response.data) {
      console.log("✅ [PROCESS_PROMPT] Successfully received response:", {
        idsCount: response.data.ids?.length || 0,
        linksCount: response.data.links?.length || 0,
        proposalsCount: response.data.proposals?.length || 0,
        hasAnalysis: !!response.data.analysis
      });
      
      return response.data;
    } else {
      console.log("⚠️ [PROCESS_PROMPT] Empty response received");
      return null;
    }

  } catch (error) {
    console.error("❌ [PROCESS_PROMPT] Error processing prompt:", error);
    if (error instanceof Error) {
      console.error("❌ [PROCESS_PROMPT] Error message:", error.message);
      console.error("❌ [PROCESS_PROMPT] Error stack:", error.stack);
    }
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ [PROCESS_PROMPT] Response error status:", error.response.status);
      console.error("❌ [PROCESS_PROMPT] Response error data:", error.response.data);
    }
    throw new Error(`Failed to process prompt: ${error}`);
  }
};

const executeTool = async (
  toolName: string,
  toolCallId: any,
  args: any
): Promise<RunSubmitToolOutputsParams.ToolOutput | null> => {
  try {
    console.log(`🛠️ [TOOL_EXECUTION] Executing tool: ${toolName}`);
    console.log(`🛠️ [TOOL_EXECUTION] Tool call ID: ${toolCallId}`);
    console.log(`🛠️ [TOOL_EXECUTION] Arguments:`, args);
    
    let output: object | null = null;

    switch (toolName) {
      case "getCurrentDateAndTime":
        console.log("⏰ [TOOL] Getting current date and time");
        output = await getCurrentDateAndTime();
        break;

      case "processPrompt": {
        console.log("🤖 [TOOL] Processing prompt with NEW BACKEND API - THIS IS FOR PROPOSAL COMPARISON!");
        const params = JSON.parse(args);
        console.log("🤖 [TOOL] Parsed params for processPrompt:", params);
        
        // Extract the prompt from the parameters
        const prompt = params.prompt || params.message || args;
        console.log("🤖 [TOOL] Extracted prompt:", prompt);
        
        const response = await processPrompt(prompt);
        output = response;
        break;
      }

      default:
        console.warn(`❓ [TOOL] Unknown tool requested: ${toolName}`);
        return null;
    }

    console.log(`✅ [TOOL_EXECUTION] Tool ${toolName} completed successfully`);
    console.log(`📤 [TOOL_EXECUTION] Output preview:`, JSON.stringify(output).substring(0, 200) + (JSON.stringify(output).length > 200 ? '...' : ''));

    return {
      tool_call_id: toolCallId,
      output: JSON.stringify(output),
    };
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    return null;
  }
};

const isThreadActive = async (threadId: string) => {
  try {
    const thread = await openai.beta.threads.retrieve(threadId);
    return !!thread._request_id;
  } catch (error) {
    console.error("Error checking thread status:", error);
    return false;
  }
};

const getRunsForThread = async (threadId: any) => {
  try {
    const runs = await openai.beta.threads.runs.list(threadId);

    if (runs?.data?.length > 0) {
      console.log("Runs: ", runs);
      return runs.data;
    } else {
      console.log("No runs found for this thread.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving runs for thread:", error);
    throw new Error(`Failed to retrieve runs for thread: ${error}`);
  }
};

const waitForRunToFinish = async (threadId: any) => {
  try {
    let runFinished = false;
    const runId = null;

    while (!runFinished) {
      console.log("Checking for runs...");

      const runs = await getRunsForThread(threadId);

      if (runs && runs?.length > 0) {
        runFinished = true;

        for (const run of runs) {
          if (
            run.status === "queued" ||
            run.status === "in_progress" ||
            run.status === "requires_action"
          ) {
            console.log(`Run ${run.id} is still in progress...`);
            runFinished = false;
            await new Promise((resolve) => setTimeout(resolve, 7000));
            break;
          }
        }
      } else {
        console.log("No runs found for this thread.");
        runFinished = true;
        break;
      }
    }

    if (runId) {
      console.log(`Run ${runId} has finished successfully.`);
    }

    return runFinished;
  } catch (error) {
    console.error("Error in waitForRunToFinish:", error);
    throw new Error(`Failed to wait for run to finish: ${error}`);
  }
};

export async function POST(request: Request) {
  const { id, message } = await request.json();
  
  console.log("💬 [USER_MESSAGE] New user message received:");
  console.log("💬 [USER_MESSAGE] Chat ID:", id);
  console.log("💬 [USER_MESSAGE] Message:", message);
  
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  let chat = await getChatById({ id });

  if (!chat) {
    const threadId = (await openai.beta.threads.create({})).id;
    const title = await generateTitleFromUserMessage({ message });
    const insertedChats = await saveChat({
      id,
      userId: session.user.id,
      title,
      threadId,
    });
    chat = insertedChats[0];
  }
  
  // Define the three main sections/contexts
  const SECTIONS = {
    ACCOUNTABILITY: 'Check one proposal for accountability',
    COMPARE_PROPOSALS: 'Compare two proposals', 
    CATEGORIES: 'List all categories'
  };

  // Check which section this request belongs to
  const currentSection = message && (
    message.trim() === SECTIONS.ACCOUNTABILITY ? 'ACCOUNTABILITY' :
    message.trim() === SECTIONS.COMPARE_PROPOSALS ? 'COMPARE_PROPOSALS' :
    message.trim() === SECTIONS.CATEGORIES ? 'CATEGORIES' :
    null
  );

  // Get the last section from chat history if this is a follow-up message
  let activeSection = currentSection;
  if (!currentSection) {
    // Get existing messages from the chat to check context
    const chatMessages = await getMessagesByChatId({ id: chat.id });
    
    // Look for the most recent section selection in chat history
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      const msg = chatMessages[i];
      if (msg.role === 'user' && msg.content) {
        const content = typeof msg.content === 'string' ? msg.content : msg.content.toString();
        if (content.trim() === SECTIONS.ACCOUNTABILITY) {
          activeSection = 'ACCOUNTABILITY';
          break;
        } else if (content.trim() === SECTIONS.COMPARE_PROPOSALS) {
          activeSection = 'COMPARE_PROPOSALS';
          break;
        } else if (content.trim() === SECTIONS.CATEGORIES) {
          activeSection = 'CATEGORIES';
          break;
        }
      }
    }
  }

  console.log("🎯 [SECTION_DETECTION] Current section:", currentSection || 'none');
  console.log("🎯 [SECTION_DETECTION] Active section (including history):", activeSection || 'none');

  // Check if this is the generic "Compare two proposals" prompt (from button click)
  const isGenericCompareRequest = currentSection === 'COMPARE_PROPOSALS';
  
  // Check if we're in the Compare Proposals context (either initial click or follow-up)
  const isInCompareProposalsContext = activeSection === 'COMPARE_PROPOSALS';
  
  if (isGenericCompareRequest) {
    console.log("🔍 [GENERIC_COMPARE] DETECTED! Generic 'Compare two proposals' request - providing guidance");
    
    // Provide guidance without calling any API
    const guidanceResponse = `Do you have specific proposal titles or IDs in mind for comparison? Some examples are:

- Compare two referendas with ID 1679 1680
- Compare two discussions with ID 3310 and 3311
- Compare two proposals https://polkadot.polkassembly.io/referenda/1696 and https://polkadot.polkassembly.io/referenda/1697  
- Give me details on proposal ID 1681

Please provide specific proposal IDs, links for a detailed comparison analysis.`;

    console.log("📝 [GUIDANCE_RESPONSE] Sending guidance response without API call");

    // Save the user message first
    await saveMessages({
      messages: [
        {
          role: "user",
          content: message,
          id: generateUUID(),
          createdAt: new Date(),
          chatId: chat.id,
        },
      ],
    });

    // Return guidance response immediately
    return AssistantResponse(
      { threadId: chat.threadId, messageId: generateUUID() },
      async ({ sendMessage }) => {
        await sendMessage({
          id: generateUUID(),
          role: "assistant",
          content: [
            {
              type: "text",
              text: {
                value: guidanceResponse
              }
            }
          ],
        });
        
        // Save the assistant message
        await saveMessages({
          messages: [
            {
              role: "assistant",
              content: guidanceResponse,
              id: generateUUID(),
              createdAt: new Date(),
              chatId: chat.id,
            },
          ],
        });
        
        console.log("✅ [GUIDANCE_RESPONSE] Guidance sent successfully");
      }
    );
  }
  
  if (isInCompareProposalsContext && !isGenericCompareRequest) {
    console.log("🔍 [SPECIFIC_COMPARE] DETECTED! Specific proposal comparison request with IDs/details");
    console.log("🔍 [SPECIFIC_COMPARE] Will use NEW_BACKEND_API:", process.env.NEW_BACKEND_API || "Not set - REQUIRED!");
    console.log("🔍 [SPECIFIC_COMPARE] Full message will be sent as prompt to backend");
    
    // DIRECTLY call our new API for specific proposal comparison requests
    console.log("🚀 [DIRECT_API_CALL] Bypassing OpenAI Assistant and calling NEW_BACKEND_API directly for proposal comparison");
    try {
      const directResult = await processPrompt(message);
      console.log("✅ [DIRECT_API_CALL] Successfully got response from NEW_BACKEND_API:", JSON.stringify(directResult, null, 2));
      
      // Save the user message first
      await saveMessages({
        messages: [
          {
            role: "user",
            content: message,
            id: generateUUID(),
            createdAt: new Date(),
            chatId: chat.id,
          },
        ],
      });
      
      // Extract and format only the analysis part
      const analysis = directResult.analysis;
      let analysisResponse = '';
      
      if (analysis && analysis.trim()) {
        // Format the analysis with proper line breaks for better readability
        let formattedAnalysis = analysis
          // Add line breaks before main sections
          .replace(/## (Proposal \d+:)/g, '\n\n## $1')
          .replace(/## (Comparison:)/g, '\n\n## $1')
          // Add line breaks before subsections
          .replace(/\*\*(Title|Type|Proposer|Reward|Category|Status|Creation Date|Description|Voting Status|Timeline|Cost|Milestones|Impact on Polkadot|Completeness):\*\*/g, '\n\n**$1:**')
          // Clean up any multiple line breaks
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        analysisResponse = `# 📊 Proposal Analysis

${formattedAnalysis}`;
      } else {
        // No analysis available - provide helpful guidance
        analysisResponse = `This is currently beyond my current capabilities. Please rephrase your question or see examples below.
- Compare two referendas with ID 1679 1680
- Compare two discussions with ID 3310 and 3311
- Compare two proposals https://polkadot.polkassembly.io/referenda/1696 and https://polkadot.polkassembly.io/referenda/1697  
- Give me details on proposal ID 1681

Please provide specific proposal IDs, links for a detailed comparison analysis.`;
      }

      console.log("🚀 [ASSISTANT_RESPONSE] Using AssistantResponse with proper streaming");

      // Return AssistantResponse that works with useAssistant hook
      return AssistantResponse(
        { threadId: chat.threadId, messageId: generateUUID() },
        async ({ sendMessage }) => {
          console.log("📤 [SEND_MESSAGE] Sending analysis message");
          
          // Save the user message first
          await saveMessages({
            messages: [
              {
                role: "user",
                content: message,
                id: generateUUID(),
                createdAt: new Date(),
                chatId: chat.id,
              },
            ],
          });
          
          // Send the analysis message
          await sendMessage({
            id: generateUUID(),
            role: "assistant",
            content: [
              {
                type: "text",
                text: {
                  value: analysisResponse
                }
              }
            ],
          });
          
          // Save the assistant message
          await saveMessages({
            messages: [
              {
                role: "assistant",
                content: analysisResponse,
                id: generateUUID(),
                createdAt: new Date(),
                chatId: chat.id,
              },
            ],
          });
          
          console.log("✅ [SEND_MESSAGE] Analysis sent successfully");
        }
      );
      
    } catch (error) {
      console.error("❌ [DIRECT_API_CALL] Error calling NEW_BACKEND_API:", error);
      // Continue with normal OpenAI Assistant flow as fallback
    }
  }

    // Continue with normal OpenAI Assistant flow for other requests (accountability check, categories, etc.)
  if (activeSection === 'ACCOUNTABILITY') {
    console.log("🔍 [ACCOUNTABILITY_SECTION] Using OpenAI Assistant for accountability checks");
  } else if (activeSection === 'CATEGORIES') {
    console.log("🔍 [CATEGORIES_SECTION] Using OpenAI Assistant for categories listing");
  } else if (activeSection === 'COMPARE_PROPOSALS') {
    console.log("🔍 [COMPARE_PROPOSALS_SECTION] Using NEW_BACKEND_API for proposal comparison");
  } else {
    console.log("🔄 [GENERAL_CHAT] Using OpenAI Assistant for general chat (no specific section)");
  }
  
  if (!chat) {
    const threadId = (await openai.beta.threads.create({})).id;
    const title = await generateTitleFromUserMessage({ message });
    const insertedChats = await saveChat({
      id,
      userId: session.user.id,
      title,
      threadId,
    });
    chat = insertedChats[0];
  }

  const threadIsActive = await isThreadActive(chat.threadId);
  if (!threadIsActive) {
    throw new Error("Thread is not active, unable to continue.");
  }

  const isRunCompleted = await waitForRunToFinish(chat.threadId);

  if (!isRunCompleted) {
    throw new Error("The run was not completed successfully.");
  }

  await saveMessages({
    messages: [
      {
        role: "user",
        content: message,
        id: generateUUID(),
        createdAt: new Date(),
        chatId: chat.id,
      },
    ],
  });

  const createdMessage = await openai.beta.threads.messages.create(
    chat.threadId,
    {
      role: "user",
      content: message,
    }
  );

  return AssistantResponse(
    { threadId: chat.threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      let runResult = await forwardStream(
        openai.beta.threads.runs.stream(chat.threadId, {
          assistant_id:
            process.env.ASSISTANT_ID ??
            (() => {
              throw new Error("ASSISTANT_ID is not set");
            })(),
          
        })
      );
      console.log(
        `runResult: status=${runResult.status} type=${runResult.required_action?.type}`
      );

      while (
        runResult?.status === "requires_action" &&
        runResult.required_action?.type === "submit_tool_outputs"
      ) {
        const tool_outputs: Array<RunSubmitToolOutputsParams.ToolOutput> = [];
        const toolCalls =
          runResult.required_action.submit_tool_outputs.tool_calls;

        for (const tool_call of toolCalls) {
          const { id: toolCallId, function: fn } = tool_call;
          const { name, arguments: args } = fn;
          const result = await executeTool(name, toolCallId, args);
          if (result) tool_outputs.push(result);
        }

        try {
          runResult = await forwardStream(
            openai.beta.threads.runs.submitToolOutputsStream(
              chat.threadId,
              runResult.id,
              { tool_outputs }
            )
          );
        } catch (error) {
          console.error("Error submitting tool outputs:", error);

          // if there is an error submitting tool outputs, we need to submit an error message instead for all called tools
          // in order to get the run out of the requires_action state
          if (error instanceof APIError) {
            const error_outputs: Array<RunSubmitToolOutputsParams.ToolOutput> =
              [];

            for (const tool_call of toolCalls) {
              error_outputs.push({
                tool_call_id: tool_call.id,
                output:
                  `An error occurred while processing your request: ${error.message}`,
              });
            }
            runResult = await forwardStream(
              openai.beta.threads.runs.submitToolOutputsStream(
                chat.threadId,
                runResult.id,
                { tool_outputs: error_outputs }
              )
            );
          }
        }
      }

      if (runResult?.status === "completed") {
        const lastMessages = await openai.beta.threads.messages.list(
          chat.threadId,
          {
            order: "desc",
            limit: 1,
          }
        );
        const lastMessage = lastMessages.data[0];
        if (lastMessage.content[0].type === "text") {
          const content = lastMessage.content[0];
          await saveMessages({
            messages: [
              {
                role: lastMessage.role,
                content: content.text.value,
                id: generateUUID(),
                createdAt: new Date(),
                chatId: chat.id,
              },
            ],
          });
        }
      } else {
        console.log("runResult?.status ", runResult?.status);
      }
    }
  );
}
