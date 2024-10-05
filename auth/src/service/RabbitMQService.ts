import { Connection } from "rabbitmq-client";
import { EventEmitter } from "events";

class RabbitMQService extends EventEmitter {
  private connection: Connection | null = null;

  constructor() {
    super(); // Call the parent constructor
  }

  // Connect to RabbitMQ
  async connect(url: string): Promise<void> {
    try {
      this.connection = new Connection(url);

      // Wait for the connection to be established
      // Ensure this method exists in your library
      console.log("Connected to RabbitMQ");

      // Emit a connection event
      this.emit("connection");
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);

      // Emit an error event
      this.emit("error", error);
      throw error; // Propagate the error if needed
    }
  }

  // Add any additional methods for publishing and consuming messages here
}

export const rabbit = new RabbitMQService();
