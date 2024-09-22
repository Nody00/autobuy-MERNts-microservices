import { app } from "./app";

const start = async () => {
  console.log("Likes service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(3000, () => {
    console.log("Likes listening on port 3000...");
  });
};

start();
