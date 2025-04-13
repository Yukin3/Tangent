const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/Users');

async function syncClerkUser(req, res, next) {
  const userId = req.header('clerk-user-id'); //Send from frontend

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let user = await User.findOne({ auth0Id: clerkUserId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      user = new User({
        auth0Id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        // You can extend this with name, image, etc.
      });

      await user.save();
      console.log('✅ Synced Clerk user to MongoDB:', user.email);
    }

    req.mongoUser = user; // Attach to request for access in route
    next();
  } catch (err) {
    console.error('❌ Error syncing user:', err.message);
    res.status(500).json({ error: 'Failed to sync user' });
  }
}

module.exports = syncClerkUser;
