"use client";

import { useEffect, useState } from "react";
import type { Message } from "ai";

export function useRemainingRequests(messages: Message[]) {
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);

  useEffect(() => {
    // Find the most recent assistant message that contains remaining requests info
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) return;
    
    // Look for remaining requests in the most recent assistant message
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
    
    if (typeof lastAssistantMessage.content === 'string') {
      // Look for the pattern "*Remaining requests: X*" in the message
      const match = lastAssistantMessage.content.match(/\*Remaining requests: (\d+)\*/);
      if (match) {
        const count = parseInt(match[1], 10);
        setRemainingRequests(count);
      }
    }
  }, [messages]);

  return remainingRequests;
}
