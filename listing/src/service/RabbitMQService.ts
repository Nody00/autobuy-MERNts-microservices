import { Connection, Publisher } from "rabbitmq-client";
import { EventEmitter } from "events";

class RabbitMQService extends EventEmitter {
  private connection: Connection | null = null;
  private publisher: Publisher | null = null;

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
      // throw error; // Propagate the error if needed
    }
  }

  async initializePublisher(): Promise<void> {
    try {
      if (!this.connection) {
        throw new Error("Connection not initialized cannot create publisher!");
      }

      this.publisher = this.connection?.createPublisher({
        // Enable publish confirmations, similar to consumer acknowledgements
        confirm: true,
        // Enable retries
        maxAttempts: 10,
        // Optionally ensure the existence of an exchange before we use it
        exchanges: [{ exchange: "listing-events", type: "topic" }],
      });
    } catch (error) {
      console.error("Failed to initialize publisher:", error);

      // Emit an error event
      this.emit("error", error);
      // throw error; // Propagate the error if needed
    }
  }

  async sendMessage(
    exchange: string,
    routingKey: string,
    message: object
  ): Promise<void> {
    if (!this.publisher) {
      throw new Error("Publisher not initialized cannot send message!");
    }

    await this.publisher.send(
      {
        exchange: exchange,
        routingKey: routingKey,
      },
      message
    );
  }
}

export const rabbit = new RabbitMQService();
