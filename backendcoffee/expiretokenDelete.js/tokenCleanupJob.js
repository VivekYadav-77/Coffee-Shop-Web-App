import cron from 'node-cron';
import { Customermodel } from '../models/customerschema.js';

export const startTokenCleanupJob = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log(' Running scheduled job: Cleaning up expired refresh tokens...');
    
    const now = new Date();
    
    try {
      const result = await Customermodel.updateMany(
        { 'refreshTokens.expiresAt': { $lt: now } },
        { $pull: { refreshTokens: { expiresAt: { $lt: now } } } }
      );

      console.log(`✅ Token cleanup finished. Modified ${result.modifiedCount} user documents.`);
    } catch (error) {
      console.error('❌ Error during token cleanup job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" 
  });
};