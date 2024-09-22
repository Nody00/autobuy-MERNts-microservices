import { app } from "./app";

const start = async () => {
  console.log("Query service booting up...");
  try {
    // connect to mongoose and stuff
  } catch (error) {}

  app.listen(3000, () => {
    console.log("Query listening on port 3000...");
  });
};

start();
