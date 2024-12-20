import { AssistantResponse } from "ai";
import OpenAI from "openai";
import https from "https";
import { readFileSync } from "fs";
import axios from "axios";

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

import { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs.mjs";
import { getChatById, saveChat, saveMessages } from "@/lib/db/queries";
import { generateTitleFromUserMessage } from "@/app/(chat)/actions";
import { auth } from "@/app/(auth)/auth";
import { message } from "@/lib/db/schema";
import { generateUUID } from "@/lib/utils";
import { threadId } from "worker_threads";

type AllowedTools =
  | "createDocument"
  | "updateDocument"
  | "requestSuggestions"
  | "getWeather"
  | "getCurrentDate"
  | "getProposalsCountAndProposalsNamesList";

const blocksTools: AllowedTools[] = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
];
const weatherTools: AllowedTools[] = ["getWeather"];
const dateTools: AllowedTools[] = ["getCurrentDate"];
const proposalsCountAndProposalsNamesList: AllowedTools[] = [
  "getProposalsCountAndProposalsNamesList",
];
const allTools: AllowedTools[] = [
  ...blocksTools,
  ...weatherTools,
  ...dateTools,
];

export async function POST(request: Request) {
  // Parse the request body
  const { id, message }: { id: string; message: string } = await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  let chat = await getChatById({ id });

  if (!chat) {
    // Create a thread if needed
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

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(
    chat.threadId,
    {
      role: "user",
      content: message,
    }
  );

  const getWeatherData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }

      const weatherData = await response.json();
      return weatherData; // Return the parsed JSON response
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error; // Re-throw the error for handling by the caller
    }
  };

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
      console.error("Error fetching current date data:", error);
      throw error; // Re-throw the error for handling by the caller
    }
  };

  return AssistantResponse(
    { threadId: chat.threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(chat.threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),

        // tools: [
        //   {
        //       "type": "file_search",
        //       "file_search": {
        //           "ranking_options": {
        //               "score_threshold": 0.75
        //           }
        //       }
        //   }
        // ]
      });

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);

      // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
      while (
        runResult?.status === "requires_action" &&
        runResult.required_action?.type === "submit_tool_outputs"
      ) {
        console.log(runResult.required_action);
        const tool_outputs: Array<RunSubmitToolOutputsParams.ToolOutput> = [];

        for (const tool_call of runResult.required_action.submit_tool_outputs
          .tool_calls) {
          const { id: toolCallId, function: fn } = tool_call;
          const { name, arguments: args } = fn;
          if (name === "getWeather") {
            const { latitude, longitude } = JSON.parse(args);
            const weather = await getWeatherData(latitude, longitude);
            tool_outputs.push({
              tool_call_id: toolCallId,
              output: JSON.stringify(weather),
            });
          }

          if (name === "getCurrentDate") {
            const date = await getCurrentDate();
            tool_outputs.push({
              tool_call_id: toolCallId,
              output: JSON.stringify(date),
            });
          }

          if (name === "getProposalsCountAndProposalsNamesList") {
            const date = await getProposalsCountAndProposalsNamesList();
            tool_outputs.push({
              tool_call_id: toolCallId,
              output: JSON.stringify(date),
            });
          }
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
