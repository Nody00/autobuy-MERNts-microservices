import nodemailer from "nodemailer";
import { Listing } from "../models/Listing";
import { User } from "../models/User";
import { Bid } from "../models/Bid";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Nodemailer transporter configuration settings
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "admin",
        pass: "password",
      },
    });
  }

  async sendBidEndNotification(
    listingId: string,
    sellerId: string,
    buyerId: string | undefined,
    type: string,
    message: string,
    noBids: boolean
  ) {
    try {
      if (noBids) {
        if (!listingId || !sellerId) {
          return;
        }
        const foundSeller = await User.findById(sellerId);
        const foundListing = await Listing.findById(listingId);
        if (!foundListing) {
          console.error("Can't find listing", listingId);
          return;
        }

        if (!foundSeller) {
          console.error("Can't find seller", sellerId);
          return;
        }

        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || "noreply@auction.com",
          to: foundSeller.email,
          subject: "Your Auction Has Ended",
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Auction Ended: ${foundListing.manufacturer} ${foundListing.model} ${foundListing.price}</h2>
                <p>Congratulations! Your auction has successfully concluded.</p>
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
                
                  <p>No bids were made
                  </p>
                  
                </div>
                <p>Please proceed with the sale and delivery of your item.</p>
                <p>Thank you for using our auction platform!</p>
              </div>
            `,
        });
      }
    } catch (error) {}
  }
}

export const emailService = new EmailService();
