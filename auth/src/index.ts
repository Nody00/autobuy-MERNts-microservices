import { app } from "./app";

const start = async () => {
  console.log("Auth service V2 booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(4001, () => {
    console.log("Auth service V2 listening on port 4001...");
  });
};

start();
