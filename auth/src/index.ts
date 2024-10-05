import { app } from "./app";
import { rabbit } from "./service/RabbitMQService";

const start = async () => {
  console.log("Auth service V2 booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4001, () => {
    console.log("Auth service V2 listening on port 4001...");

    rabbit.connect("amqp://admin:password@rabbitmq-srv:5672");
  });
};

start();
