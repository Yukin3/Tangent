require('dotenv').config();
const { clerkClient } = require('@clerk/clerk-sdk-node');


async function seedUser() {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: ['test01@example.com'],
      password: 'TangentTest0',
      firstName: 'Test01',
      lastName: 'User',
    });

    console.log('✅ Created Clerk user:', user.id);
  } catch (err) {
    console.error('❌ Error creating user:', err);
  }
}

seedUser();
