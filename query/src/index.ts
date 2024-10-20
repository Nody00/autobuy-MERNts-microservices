import { app } from "./app";
import mongoose from "mongoose";
import { rabbit } from "./service/RabbitMQService";
const start = async () => {
  console.log("Query service booting up...");
  try {
    // connect to mongoose and stuff
    app.listen(3000, () => {
      console.log("Query listening on port 3000...");

      mongoose.connect("mongodb://query-mongo-srv:27017");
      console.log("Mongodb connection intilized");

      rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
      console.log("RABBITMQ connection intilized");

      rabbit.initilizeNewUserConsumer();
      rabbit.initilizeNewListingConsumer();
    });
  } catch (error) {}
};

start();
