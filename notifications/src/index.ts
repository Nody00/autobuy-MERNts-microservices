import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";
import mongoose from "mongoose";

const start = async () => {
  console.log("notification service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4005, async () => {
    if (!process.env.COOKIE_SESSION_KEY) {
      console.error("COOKIE SESSION KEY MISSING");
      return;
    }
    if (!process.env.JWT_SECRET!) {
      console.error("JWT SECRET MISSING");
      return;
    }

    await mongoose.connect("mongodb://notification-mongo-srv:27017");

    await rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");

    console.log("notification listening on port 4005...");
  });
};

start();
