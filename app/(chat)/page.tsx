import { Chat } from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import { auth } from "@/app/(auth)/auth";
import { notFound } from "next/navigation";

export default async function Page() {
  const id = generateUUID();

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  return (
    <Chat
      key={id}
      id={id}
      userName={
        session.user.name ? session.user.name : session.user.email || ""
      }
      initialMessages={[]}
    />
  );
}
