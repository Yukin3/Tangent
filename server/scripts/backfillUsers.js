require('dotenv').config();
const mongoose = require('mongoose');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const connectToDB = require('../config/db');
const User = require('../models/Users');

async function backfillUsers() {
  await connectToDB();

  const allClerkUsers = await clerkClient.users.getUserList({ limit: 100 });

  for (const clerkUser of allClerkUsers) {
    const exists = await User.findOne({ auth0Id: clerkUser.id });

    if (!exists) {
      const newUser = new User({
        auth0Id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
      });

      await newUser.save();
      console.log('✅ Backfilled:', newUser.email);
    } else {
      console.log('↪️ Already exists:', exists.email);
    }
  }

  mongoose.disconnect();
}

backfillUsers();
