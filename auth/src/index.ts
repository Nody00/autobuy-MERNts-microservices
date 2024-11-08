import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";
import mongoose from "mongoose";
import { InitializeRoles } from "./helpers/InitilizeRoles";

const start = async () => {
  console.log("Auth service V2 booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4001, async () => {
    if (!process.env.COOKIE_SESSION_KEY) {
      console.error("COOKIE SESSION KEY MISSING");
      return;
    }
    if (!process.env.JWT_SECRET!) {
      console.error("JWT SECRET MISSING");
      return;
    }
    if (!process.env.REFRESH_JWT_SECRET!) {
      console.error("REFRESH JWT SECRET MISSING");
      return;
    }

    await mongoose.connect("mongodb://auth-mongo-srv:27017");

    // To make sure the default roles are already in the DB
    await InitializeRoles();

    await rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
    await rabbit.initializePublisher();
    await rabbit.initilizeListingBookmarkConsumer();
    console.log("Auth service V2 listening on port 4001...");
  });
};

start();
