import {
  Connection,
  Publisher,
  Consumer,
  ConsumerStatus,
} from "rabbitmq-client";
import { EventEmitter } from "events";
import { handleListingEvent } from "../event_types/handleListingEvent";

class RabbitMQService extends EventEmitter {
  private connection: Connection | null = null;
  private publisher: Publisher | null = null;
  private consumer: Consumer | null = null;
  private connectionUrl: string = "";
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 10;
  private readonly reconnectInterval: number = 5000;

  constructor() {
    super(); // Call the parent constructor
  }

  // Connect to RabbitMQ
  async connect(url: string): Promise<void> {
    this.connectionUrl = url;
    await this.attemptConnection();
  }

  private async attemptConnection(): Promise<void> {
    try {
      this.connection = new Connection(this.connectionUrl);

      // Setup connection event listeners
      this.connection.on("error", async (error) => {
        console.error("RabbitMQ connection error:", error);
        await this.handleDisconnect();
      });

      this.connection.on("connection.blocked", async () => {
        console.log("RabbitMQ connection closed");
        await this.handleDisconnect();
      });

      console.log("Connected to RabbitMQ");
      this.reconnectAttempts = 0;
      this.emit("connection");

      // Initialize publisher and consumer after successful connection
      await this.initializePublisher();
      await this.initilizeListingConsumer();
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      await this.handleDisconnect();
    }
  }

  private async handleDisconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.emit(
        "error",
        new Error("Failede to reconnect after maximum attempts")
      );
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    // Clean up existing connections
    await this.cleanup();

    // Wait for the reconnect interval
    await new Promise((resolve) => setTimeout(resolve, this.reconnectInterval));
    await this.attemptConnection();
  }

  private async cleanup(): Promise<void> {
    try {
      if (this.consumer) {
        await this.consumer.close();
        this.consumer = null;
      }
      if (this.publisher) {
        await this.publisher.close();
        this.publisher = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
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

  async initilizeListingConsumer(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not initialized cannot initilize consumer");
    }
    this.consumer = this.connection.createConsumer(
      {
        queue: "listingService-listing-events-queue",
        queueOptions: { durable: true },
        // handle 2 messages at a time
        qos: { prefetchCount: 2 },
        // Optionally ensure an exchange exists
        exchanges: [{ exchange: "listing-events", type: "topic" }],
        // With a "topic" exchange, messages matching this pattern are routed to the queue
        queueBindings: [
          { exchange: "listing-events", routingKey: "listings.*" },
        ],
      },
      async (msg) => {
        try {
          await handleListingEvent(msg);
          return ConsumerStatus.ACK;
        } catch (error) {
          console.log("Query handler error", error);
          return ConsumerStatus.DROP;
        }
      }
    );
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
