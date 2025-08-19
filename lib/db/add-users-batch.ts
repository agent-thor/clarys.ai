import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { user } from './schema';
import { genSaltSync, hashSync } from 'bcrypt-ts';

config();

const addUsersBatch = async () => {
  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL environment variable is not set!');
    console.error('❌ Please check your .env file contains POSTGRES_URL');
    process.exit(1);
  }

  // List of users to add
  const usersToAdd = [
    'xcrom1@protonmail.com',
    'ivan@distractive.xyz',
    'yayoikusamarian@gmail.com',
    'christiancasini1993@gmail.com',
    'w@multisig.wtf',
    'Heyjaychrawnna@gmail.com',
    'jslusser@kurkuma.co',
    'bill@web3.foundation',
    'tommi.enenkel@opengov.watch',
    'mario@schraepen.eu',
    'raul@justopensource.io',
    'karam@web3.foundation',
    'eric@distractive.xyz',
    'karim@parity.io',
    '0xtaylor@chaosdao.org',
    'itsbirdo@pm.me',
    'matteo@substancelabs.xyz',
    'mntcrpt@gmail.com',
    'w3nerick@hotmail.com',
    'spectracryptoverse@gmail.com',
    'wario@soft.law',
    'chris_pap8@hotmail.com'
  ];

  // Remove duplicates
  const uniqueUsers = [...new Set(usersToAdd)];

  console.log(`🚀 Starting batch user addition for ${uniqueUsers.length} unique users...`);

  try {
    // Initialize database connection
    const client = postgres(process.env.POSTGRES_URL!);
    const db = drizzle(client);
    
    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const email of uniqueUsers) {
      try {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          console.error(`❌ Invalid email format: ${email}`);
          errorCount++;
          continue;
        }

        console.log(`🔍 Checking if user ${email} already exists...`);
        
        // Check if user already exists
        const existingUsers = await db.select().from(user).where(eq(user.email, email));
        if (existingUsers.length > 0) {
          console.log(`⚠️  User ${email} already exists - skipping`);
          skippedCount++;
          continue;
        }

        console.log(`➕ Adding new user ${email}...`);
        
        // Add new user (password doesn't matter since validation is disabled)
        const salt = genSaltSync(10);
        const hash = hashSync('defaultpassword', salt);
        await db.insert(user).values({ email, password: hash });
        
        console.log(`✅ SUCCESS: User ${email} added!`);
        addedCount++;
        
      } catch (error) {
        console.error(`❌ FAILED to add user ${email}:`, error);
        errorCount++;
      }
    }

    await client.end();
    
    console.log('\n📊 BATCH OPERATION SUMMARY:');
    console.log(`✅ Successfully added: ${addedCount} users`);
    console.log(`⚠️  Already existed: ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📝 Total processed: ${addedCount + skippedCount + errorCount} users`);
    
    if (addedCount > 0) {
      console.log('\n🎉 All new users can now login using just their email address!');
    }
    
  } catch (error) {
    console.error('❌ BATCH OPERATION FAILED:', error);
    process.exit(1);
  }
  
  process.exit(0);
};

addUsersBatch();
