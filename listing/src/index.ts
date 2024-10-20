import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";
import mongoose from "mongoose";
const start = async () => {
  console.log("Listing service booting up...");

  app.listen(4002, () => {
    if (!process.env.COOKIE_SESSION_KEY) {
      console.error("COOKIE SESSION KEY MISSING");
      return;
    }
    if (!process.env.JWT_SECRET!) {
      console.error("JWT SECRET MISSING");
      return;
    }
    console.log("Listing service listening on port 4002...");

    mongoose.connect("mongodb://listing-mongo-srv:27017");

    rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
    rabbit.initializePublisher();
  });
};

start();
