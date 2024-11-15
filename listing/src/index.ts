import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";
import mongoose from "mongoose";
const start = async () => {
  console.log("Listing service booting up...");

  app.listen(4002, async () => {
    if (!process.env.COOKIE_SESSION_KEY) {
      console.error("COOKIE SESSION KEY MISSING");
      return;
    }
    if (!process.env.JWT_SECRET!) {
      console.error("JWT SECRET MISSING");
      return;
    }

    await mongoose.connect("mongodb://listing-mongo-srv:27017");

    await rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
    await rabbit.initializePublisher();
    await rabbit.initilizeListingConsumer();
    console.log("Listing service listening on port 4002...");
  });
};

start();
