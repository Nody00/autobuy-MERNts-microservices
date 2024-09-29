import { app } from "./app";

const start = async () => {
  console.log("Event bus service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(5000, () => {
    console.log("Event bus listening on port 5000...");
  });
};

start();
