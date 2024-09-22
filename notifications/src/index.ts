import { app } from "./app";

const start = async () => {
  console.log("Notifications service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(3000, () => {
    console.log("Notifications listening on port 3000...");
  });
};

start();
