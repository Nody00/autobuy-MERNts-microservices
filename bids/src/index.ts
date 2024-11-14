import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";
import mongoose from "mongoose";

const start = async () => {
  console.log("Bids service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4004, async () => {
    if (!process.env.COOKIE_SESSION_KEY) {
      console.error("COOKIE SESSION KEY MISSING");
      return;
    }
    if (!process.env.JWT_SECRET!) {
      console.error("JWT SECRET MISSING");
      return;
    }

    await mongoose.connect("mongodb://bids-mongo-srv:27017");

    await rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
    await rabbit.initializePublisher();
    await rabbit.initilizeNewListingConsumer();

    console.log("Bids listening on port 4004...");
  });
};

start();
