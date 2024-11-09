import { app } from "./app";
import mongoose from "mongoose";
import { rabbit } from "./service/RabbitMQService";
const start = async () => {
  console.log("Query service booting up...");
  try {
    // connect to mongoose and stuff
    app.listen(4003, async () => {
      console.log("Query listening on port 4003...");

      await mongoose.connect("mongodb://query-mongo-srv:27017");
      console.log("Mongodb connection intilized");

      await rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
      console.log("RABBITMQ connection intilized");

      await rabbit.initilizeUserEventConsumer();
      await rabbit.initilizeNewListingConsumer();
      await rabbit.initilizeListingBookmarkConsumer();
    });
  } catch (error) {}
};

start();
