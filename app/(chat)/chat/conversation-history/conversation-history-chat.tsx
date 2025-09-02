"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatHeader } from '@/components/chat-header';
import { Markdown } from '@/components/markdown';
import { useScrollToBottom } from '@/components/use-scroll-to-bottom';

interface ConversationQuery {
  query: string;
  response: {
    accountability_analysis?: string;
    analysis?: string;
    answer?: string;
  };
}

interface ConversationData {
  section: 'accountability-check' | 'extract-with-proposals' | 'general-chat';
  queries: ConversationQuery[];
}

interface ConversationHistoryChatProps {
  conversationId: string;
}

export function ConversationHistoryChat({ conversationId }: ConversationHistoryChatProps) {
  const router = useRouter();
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
  }>>([]);
  const [loading, setLoading] = useState(true);

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Add a small delay to ensure sessionStorage has been written
    const timer = setTimeout(() => {
      try {
        const storedData = sessionStorage.getItem(conversationId);
        if (!storedData) {
          console.error('No conversation data found for ID:', conversationId);
          router.push('/'); // Redirect to home if data not found
          return;
        }

        const data: ConversationData = JSON.parse(storedData);
        setConversationData(data);

      // Convert queries to chat messages format
      const chatMessages: Array<{
        id: string;
        role: 'user' | 'assistant';
        content: string;
        createdAt: Date;
      }> = [];

      data.queries.forEach((query, index) => {
        // Add user message
        chatMessages.push({
          id: `user-${index}`,
          role: 'user',
          content: query.query.trim(),
          createdAt: new Date(Date.now() - (data.queries.length - index) * 60000), // Simulate timestamps
        });

        // Add assistant response
        let responseContent = '';
        if (query.response.accountability_analysis) {
          responseContent = query.response.accountability_analysis;
        } else if (query.response.analysis) {
          responseContent = query.response.analysis;
        } else if (query.response.answer) {
          responseContent = query.response.answer;
        }

        if (responseContent) {
          chatMessages.push({
            id: `assistant-${index}`,
            role: 'assistant',
            content: responseContent,
            createdAt: new Date(Date.now() - (data.queries.length - index) * 60000 + 30000),
          });
        }
      });

      setMessages(chatMessages);
      
        // Clean up sessionStorage after reading
        sessionStorage.removeItem(conversationId);
      } catch (error) {
        console.error('Error parsing conversation data:', error);
        router.push('/'); // Redirect to home if parsing fails
      } finally {
        setLoading(false);
      }
    }, 100); // Small delay to ensure navigation completed

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [conversationId, router]);

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'accountability-check':
        return 'Accountability Check History';
      case 'extract-with-proposals':
        return 'Proposal Comparison History';
      case 'general-chat':
        return 'General Chat History';
      default:
        return 'Conversation History';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-0 h-dvh bg-background">
        <ChatHeader 
          userName="User"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading conversation history...</div>
        </div>
      </div>
    );
  }

  if (!conversationData) {
    return (
      <div className="flex flex-col min-h-0 h-dvh bg-background">
        <ChatHeader 
          userName="User"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Conversation not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 h-dvh bg-background">
              <ChatHeader 
          userName="User"
        />
      
      <div className="flex flex-col min-h-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
        <div className="mx-auto max-w-3xl px-4 flex flex-col gap-4">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <h1 className="text-2xl font-semibold text-foreground">
              {getSectionTitle(conversationData.section)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {conversationData.queries.length} conversation{conversationData.queries.length !== 1 ? 's' : ''} from your history
            </p>
          </div>

                           {/* Messages */}
                 {messages.map((message, index) => (
                   <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                       message.role === 'user' 
                         ? 'bg-blue-600 text-white ml-auto' 
                         : 'bg-muted text-foreground'
                     }`}>
                       {message.role === 'user' ? (
                         <p className="text-sm">{message.content}</p>
                       ) : (
                         <div className="text-sm">
                           <Markdown>{message.content}</Markdown>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
