import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import {auth} from "@/app/(auth)/auth";
import {notFound} from "next/navigation";

export default async function Page() {
  const id = generateUUID();

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <Chat
      key={id}
      id={id}
      user={session.user}
      initialMessages={[]}
      selectedModelId={selectedModelId}
    />
  );
}
