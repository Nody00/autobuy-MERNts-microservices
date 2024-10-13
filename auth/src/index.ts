import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";
import mongoose from "mongoose";
const start = async () => {
  console.log("Auth service V2 booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4001, () => {
    if (!process.env.COOKIE_SESSION_KEY) {
      console.error("COOKIE SESSION KEY MISSING");
      return;
    }
    if (!process.env.JWT_SECRET!) {
      console.error("JWT SECRET MISSING");
      return;
    }
    console.log("Auth service V2 listening on port 4001...");

    mongoose.connect("mongodb://auth-mongo-srv:27017");

    rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
    rabbit.initializePublisher();
  });
};

start();
