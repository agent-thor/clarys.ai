import { notFound } from 'next/navigation';
import { ConversationHistoryChat } from './conversation-history-chat';

export default async function ConversationHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  
  if (!params.id) {
    notFound();
  }

  // We'll handle the sessionStorage reading in the client component
  return <ConversationHistoryChat conversationId={params.id} />;
}
