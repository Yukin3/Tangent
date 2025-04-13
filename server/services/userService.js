const User = require('../models/Users');
const { clerkClient } = require('@clerk/clerk-sdk-node');

exports.findOrCreateFromClerk = async (clerkUserId) => {
  let user = await User.findOne({ auth0Id: clerkUserId });

  if (user) return user;

  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  user = new User({
    auth0Id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress,
  });

  return await user.save();
};
