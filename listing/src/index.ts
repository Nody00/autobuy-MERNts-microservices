import { app } from "./app";

const start = async () => {
  console.log("Listing service booting up...");
  try {
    // connect to mongoose and stuff
    app.listen(4002, () => {
      console.log("Listing service listening on port 4002...");
    });
  } catch (error) {}
};

start();
