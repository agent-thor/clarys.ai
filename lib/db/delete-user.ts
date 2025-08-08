import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { user, chat, message } from './schema';

config();

const deleteUser = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Usage: npm run delete-user <email>');
    console.error('❌ Example: npm run delete-user olduser@example.com');
    process.exit(1);
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Invalid email format');
    process.exit(1);
  }

  try {
    console.log(`🔍 Checking if user ${email} exists...`);
    
    // Initialize database connection directly
    const client = postgres(process.env.POSTGRES_URL!);
    const db = drizzle(client);
    
    // Check if user exists
    const existingUsers = await db.select().from(user).where(eq(user.email, email));
    if (existingUsers.length === 0) {
      console.log(`⚠️  User ${email} does not exist in the database!`);
      await client.end();
      process.exit(0);
    }

    const userId = existingUsers[0].id;
    console.log(`👤 Found user: ${email} (ID: ${userId})`);

    // Get user's chats
    const userChats = await db.select().from(chat).where(eq(chat.userId, userId));
    console.log(`💬 Found ${userChats.length} chat(s) for this user`);

    // Delete messages from user's chats
    if (userChats.length > 0) {
      console.log(`🗑️  Deleting messages from user's chats...`);
      for (const userChat of userChats) {
        await db.delete(message).where(eq(message.chatId, userChat.id));
      }
    }

    // Delete user's chats
    if (userChats.length > 0) {
      console.log(`🗑️  Deleting user's chats...`);
      await db.delete(chat).where(eq(chat.userId, userId));
    }

    // Delete the user
    console.log(`🗑️  Deleting user ${email}...`);
    await db.delete(user).where(eq(user.email, email));
    
    console.log(`✅ SUCCESS: User ${email} and all associated data has been deleted!`);
    console.log(`✅ Deleted: User account, ${userChats.length} chat(s), and all messages`);
    
    // Close database connection
    await client.end();
    
  } catch (error) {
    console.error('❌ FAILED to delete user:', error);
    process.exit(1);
  }
  
  process.exit(0);
};

deleteUser(); 