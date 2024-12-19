import { Chat } from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import { auth } from "@/app/(auth)/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Tour } from "@/components/tour";

export default async function Page() {
  const id = generateUUID();

  const [session, cookieStore] = await Promise.all([auth(), cookies()]);

  if (!session || !session?.user) {
    return notFound();
  }
  const tourCompleted = cookieStore.get("tourCompleted")?.value === "true";
  const tourNeeded =
    cookieStore.get("tourNeeded") === undefined ||
    cookieStore.get("tourNeeded")?.value === "true";

  const chatPage = (
    <Chat
      key={id}
      id={id}
      userName={
        session.user.name ? session.user.name : session.user.email || ""
      }
      initialMessages={[]}
    />
  );

  const tourPage = (
    <Tour
      userName={
        session.user.name ? session.user.name : session.user.email || ""
      }
      tourNeeded={!tourCompleted}
    ></Tour>
  );

  return <>{tourNeeded && !tourCompleted ? tourPage : chatPage}</>;
}
