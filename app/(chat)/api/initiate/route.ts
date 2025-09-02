import { auth } from "@/app/(auth)/auth";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log("🚀 [INITIATE_API] Calling initiate API for user:", userEmail);

    const newBackendApi = process.env.NEW_BACKEND_API;
    
    if (!newBackendApi) {
      console.error("❌ [INITIATE_API] NEW_BACKEND_API environment variable is not set");
      return Response.json({ error: "Backend API not configured" }, { status: 500 });
    }
    
    const apiUrl = `${newBackendApi}/initiate`;
    
    // Using GET request since backend uses @app.get
    const response = await axios.get(apiUrl);
    
    if (response.data && response.data.conversations) {
      console.log("✅ [INITIATE_API] Successfully received initiate data:", {
        message: response.data.message,
        totalConversations: response.data.total_conversations,
        endpoints: response.data.endpoints,
        hasAccountabilityCheck: !!response.data.conversations["accountability-check"],
        hasExtractWithProposals: !!response.data.conversations["extract-with-proposals"],
        hasGeneralChat: !!response.data.conversations["general-chat"]
      });
      
      // Return just the conversations object to match our frontend expectations
      return Response.json(response.data.conversations);
    } else {
      console.log("⚠️ [INITIATE_API] Empty response or missing conversations");
      return Response.json({ error: "Empty response from backend" }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ [INITIATE_API] Error calling initiate API:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ [INITIATE_API] Response error status:", error.response.status);
      console.error("❌ [INITIATE_API] Response error data:", error.response.data);
      
      return Response.json(
        { error: "Backend API error", details: error.response.data },
        { status: error.response.status }
      );
    }
    
    return Response.json(
      { error: "Failed to initiate user session" },
      { status: 500 }
    );
  }
}
