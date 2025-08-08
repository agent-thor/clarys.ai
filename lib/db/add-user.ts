import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { user } from './schema';
import { genSaltSync, hashSync } from 'bcrypt-ts';

config();

const addAuthorizedUser = async () => {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL environment variable is not set!');
    console.error('❌ Please check your .env file contains POSTGRES_URL');
    process.exit(1);
  }
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Usage: npm run add-user <email>');
    console.error('❌ Example: npm run add-user newuser@example.com');
    process.exit(1);
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Invalid email format');
    process.exit(1);
  }

  try {
    console.log(`🔍 Checking if user ${email} already exists...`);
    
    // Initialize database connection directly
    const client = postgres(process.env.POSTGRES_URL!);
    const db = drizzle(client);
    
    // Check if user already exists
    const existingUsers = await db.select().from(user).where(eq(user.email, email));
    if (existingUsers.length > 0) {
      console.log(`⚠️  User ${email} already exists in the database!`);
      console.log(`✅ They can already login with their email address.`);
      await client.end();
      process.exit(0);
    }

    console.log(`➕ Adding new user ${email} to database...`);
    
    // Add new user (password doesn't matter since validation is disabled)
    const salt = genSaltSync(10);
    const hash = hashSync('defaultpassword', salt);
    await db.insert(user).values({ email, password: hash });
    
    console.log(`✅ SUCCESS: User ${email} has been added to the database!`);
    console.log(`✅ They can now login using just their email address.`);
    
    await client.end();
    
  } catch (error) {
    console.error('❌ FAILED to add user:', error);
    process.exit(1);
  }
  
  process.exit(0);
};

addAuthorizedUser(); 