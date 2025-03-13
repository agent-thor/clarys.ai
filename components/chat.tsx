"use client";

import { type Message, useAssistant } from "ai/react";
import type { Attachment, ChatRequestOptions, CreateMessage } from "ai";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import useSWR from "swr";
import { useWindowSize } from "usehooks-ts";

import { ChatHeader } from "@/components/chat-header";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import type { Vote } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";

import { Block, type UIBlock } from "./block";
import CardPanel from "@/components/ui/card-panel";
import { MultimodalInput } from "@/components/multimodal-input";
import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { Overview } from "@/components/overview";

export function Chat({
  id,
  initialMessages,
  userName,
}: {
  id: string;
  initialMessages: Array<Message>;
  userName: string;
}) {
  const {
    status,
    messages: assistantMessages,
    setMessages,
    input,
    setInput,
    append,
    submitMessage,
    handleInputChange,
    stop,
  } = useAssistant({ api: "/api/assistant", body: { id } });

  const messages = [...initialMessages, ...assistantMessages];

  const handleSubmit = (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    submitMessage(event as React.FormEvent<HTMLFormElement>);
  };

  type HandleSubmitType = (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;

  const append_assistant: HandleSubmitType = async (
    message,
    chatRequestOptions
  ) => {
    await append(message, { data: {} });
    return Promise.resolve("");
  };

  const { width: windowWidth = 1920, height: windowHeight = 1080 } =
    useWindowSize();

  const isLoading = status === "in_progress";

  const [block, setBlock] = useState<UIBlock>({
    documentId: "init",
    content: "",
    title: "",
    status: "idle",
    isVisible: false,
    boundingBox: {
      top: windowHeight / 4,
      left: windowWidth / 4,
      width: 250,
      height: 50,
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher
  );

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="flex flex-row flex-1 align-middle justify-center py-16 h-full gap-16">
        <CardPanel fullWidth={true}>
          <ChatHeader userName={userName} />
          <div
            ref={messagesContainerRef}
            className="hiddenScroll flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
          >
            {messages.length === 0 && <Overview userName={userName} />}

            {messages.map((message, index) => (
              <PreviewMessage
                key={message.id}
                chatId={id}
                message={message}
                block={block}
                setBlock={setBlock}
                isLoading={isLoading && messages.length - 1 === index}
                vote={
                  votes
                    ? votes.find((vote) => vote.messageId === message.id)
                    : undefined
                }
              />
            ))}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "user" && (
                <ThinkingMessage />
              )}

            <div
              ref={messagesEndRef}
              className="shrink-0 min-w-[24px] min-h-[24px]"
            />
          </div>
          <form className="flex mx-auto bg-background gap-2 w-full">
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append_assistant}
            />
          </form>
        </CardPanel>
      </div>

      <AnimatePresence>
        {block?.isVisible && (
          <Block
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            append={append_assistant}
            block={block}
            setBlock={setBlock}
            messages={messages}
            setMessages={setMessages}
            votes={votes}
          />
        )}
      </AnimatePresence>

      {/* <BlockStreamHandler streamingData={streamingData} setBlock={setBlock} /> */}
    </>
  );
}
