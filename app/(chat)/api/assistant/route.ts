import { AssistantResponse } from "ai";
import OpenAI from "openai";
import https from "https";
import { readFileSync } from "fs";
import axios from "axios";
import { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs.mjs";
import { getChatById, saveChat, saveMessages } from "@/lib/db/queries";
import { generateTitleFromUserMessage } from "@/app/(chat)/actions";
import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

let agent = new https.Agent({
  rejectUnauthorized: true,
});

if (process.env.NODE_ENV === "development") {
  const certs = [readFileSync("./Zscaler_Root_CA.pem")];

  agent = new https.Agent({
    rejectUnauthorized: true,
    ca: certs,
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const blocksTools = ["createDocument", "updateDocument", "requestSuggestions"];
const dateTools = ["getCurrentDate"];
const postTools = ["getProposalsCountAndProposalsNamesList", "getPostsData"];
const allTools = [...blocksTools, ...dateTools, ...postTools];

const getCurrentDate = () => {
  const currentDate = new Date();
  return { currentDate: currentDate.toUTCString() };
};

const getProposalsCountAndProposalsNamesList = async () => {
  try {
    const response = await axios.get(
      "http://ec2-34-207-233-187.compute-1.amazonaws.com:3000/api/s3/s3GetListOfProposals"
    );

    let proposalsCountAndProposalsNamesList = {
      numberOfProposals: 0,
      proposals: [],
    };

    if (response && response?.data) {
      if (
        response.data?.errorCode &&
        response.data?.errorCode.message === "Success" &&
        response.data?.response
      ) {
        proposalsCountAndProposalsNamesList = response.data.response;
      }
    }

    return proposalsCountAndProposalsNamesList;
  } catch (error) {
    console.error("Error fetching proposals data:", error);
    throw error;
  }
};

const getPostsData = async (params: any) => {
  try {
    const response = await axios.get(
      "http://ec2-34-207-233-187.compute-1.amazonaws.com:3000/api/dynamoDB/getPostsData",
      {
        params: {
          ...params,
        },
      }
    );

    let postsData = [];

    if (response && response?.data) {
      if (
        response.data?.errorCode &&
        response.data?.errorCode.message === "Success" &&
        response.data?.response
      ) {
        postsData = response.data.response;
      }
    }

    return postsData;
  } catch (error) {
    console.error("Error fetching posts data:", error);
    throw error;
  }
};

const executeTool = async (toolName: string, toolCallId: any, args: any) => {
  try {
    switch (toolName) {
      case "getCurrentDate":
        return {
          tool_call_id: toolCallId,
          output: JSON.stringify(await getCurrentDate()),
        };

      case "getProposalsCountAndProposalsNamesList":
        return {
          tool_call_id: toolCallId,
          output: JSON.stringify(await getProposalsCountAndProposalsNamesList()),
        };

      case "getPostsData":
        const params = JSON.parse(args || "{}");
        return {
          tool_call_id: toolCallId,
          output: JSON.stringify(await getPostsData(params)),
        };

      default:
        console.warn(`Unknown tool requested: ${toolName}`);
        return null;
    }
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    return null;
  }
};

export async function POST(request: Request) {
  const { id, message } = await request.json();
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
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
            // tools: [
            //   {
            //     type: "file_search",
            //     file_search: {
            //       ranking_options: {
            //         score_threshold: 0.75,
            //       },
            //     },
            //   },
            //   {
            //     type: "function",
            //     function: {
            //       name: "getCurrentDate",
            //     },
            //   },
            //   {
            //     type: "function",
            //     function: {
            //       name: "getProposalsCountAndProposalsNamesList",
            //     },
            //   },
            //   {
            //     type: "function",
            //     function: {
            //       name: "getPostsData",
            //     },
            //   },
            // ] 
        })
      );

      while (
        runResult?.status === "requires_action" &&
        runResult.required_action?.type === "submit_tool_outputs"
      ) {
        const tool_outputs = [];
        const toolCalls = runResult.required_action.submit_tool_outputs;

        for (const tool_call of toolCalls) {
          const { id: toolCallId, function: fn } = tool_call;
          const { name, arguments: args } = fn;
          const result = await executeTool(name, toolCallId, args);
          if (result) tool_outputs.push(result);
        }

        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            chat.threadId,
            runResult.id,
            { tool_outputs }
          )
        );
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
      }
    }
  );
}
