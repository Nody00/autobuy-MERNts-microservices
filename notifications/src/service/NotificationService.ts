import Bull from "bull";
import { Notification } from "../models/Notification";
import { Bid } from "../models/Bid";
import { Listing } from "../models/Listing";

class NotificationService {
  private notificationQueue: Bull.Queue;

  constructor() {
    // We need to configure bull to user the Redis service
    this.notificationQueue = new Bull("bid-end-notifications", {
      redis: {
        host: "notification-redis-srv",
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000, // Initial delay of 1 second
        },
      },
    });

    // Add queue event handlers for monitoring
    this.notificationQueue.on("error", (error) => {
      console.error("Bull queue error:", error);
    });

    this.notificationQueue.on("failed", (job, error) => {
      console.error(`Job ${job.id} failed:`, error);
    });

    this.notificationQueue.process(async (job) => {
      try {
        await this.handleBidEnd(job.data.listing);
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        throw error; // Rethrow to trigger retry mechanism
      }
    });
  }

  async handleNewListing(listing: any) {
    // Schedule notifications for new listing
    const delay = new Date(listing.endBiddingAt).getTime() - Date.now();
    if (delay > 0) {
      await this.notificationQueue.add(
        { listing },
        {
          jobId: `listing-${listing._id}`,
          delay: 20000,
          attempts: 3,
        }
      );
    }
  }

  async handleListingUpdate(listing: any) {
    // Remove existing job if any
    if (listing.deleted) {
      await this.notificationQueue.removeJobs(`listing-${listing._id}`);
    }
  }

  private async handleBidEnd(listing: any) {
    try {
      // Create notification document
      const foundListing = await Listing.findById(listing._id);

      if (!foundListing) {
        console.error("No listing found!");
        return;
      }
      const foundBid = await Bid.findById(foundListing.highestBid);
      if (!foundBid) {
        console.error("No bid found!");
        return;
      }

      const notification = await Notification.create({
        sellerId: foundListing.userId,
        buyerId: foundBid.userId,
        listingId: foundListing._id,
        type: "BID_END",
        title: "Auction ended",
        message: "Auction ended",
      });

      await notification.save();

      // Send Email
    } catch (error) {}
  }
}

export const notificationService = new NotificationService();
