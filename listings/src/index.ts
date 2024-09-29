import { app } from "./app";

const start = async () => {
  console.log("Listing service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4002, () => {
    console.log("Listing listening on port 4002...");
  });
};

start();
