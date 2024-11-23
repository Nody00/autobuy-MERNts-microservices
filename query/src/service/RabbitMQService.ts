import {
  Connection,
  Publisher,
  Consumer,
  ConsumerStatus,
} from "rabbitmq-client";
import { EventEmitter } from "events";
import { handleListingEvent } from "../events/handleListingEvent";
import { handleBookMarkEvent } from "../events/handleBookmarkEvent";
import { handleUserEvent } from "../events/handleUserEvent";
class RabbitMQService extends EventEmitter {
  private connection: Connection | null = null;
  private publisher: Publisher | null = null;
  private consumer: Consumer | null = null;

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

  async initilizeUserEventConsumer(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not initialized cannot initilize consumer");
    }
    this.consumer = this.connection.createConsumer(
      {
        queue: "query-user-events-queue",
        queueOptions: { durable: true },
        // handle 2 messages at a time
        qos: { prefetchCount: 2 },
        // Optionally ensure an exchange exists
        exchanges: [{ exchange: "auth-events", type: "topic" }],
        // With a "topic" exchange, messages matching this pattern are routed to the queue
        queueBindings: [{ exchange: "auth-events", routingKey: "users.*" }],
      },
      async (msg) => {
        try {
          await handleUserEvent(msg);
          return ConsumerStatus.ACK;
        } catch (error) {
          return ConsumerStatus.DROP;
        }
      }
    );
  }

  async initilizeNewListingConsumer(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not initialized cannot initilize consumer");
    }
    this.consumer = this.connection.createConsumer(
      {
        queue: "query-listing-events-queue",
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

  async initilizeListingBookmarkConsumer(): Promise<void> {
    if (!this.connection) {
      throw new Error("Connection not initilized cannot initilize consumer");
    }

    this.consumer = this.connection.createConsumer(
      {
        queue: "listing-bookmark-events-queue",
        queueOptions: { durable: true },
        // handle 2 messages at a time
        qos: { prefetchCount: 2 },
        // Optionally ensure an exchange exists
        exchanges: [{ exchange: "listing-events", type: "topic" }],
        // With a "topic" exchange, messages matching this pattern are routed to the queue
        queueBindings: [
          { exchange: "listing-events", routingKey: "bookmark.*.*" },
        ],
      },
      async (msg) => {
        try {
          await handleBookMarkEvent({
            userId: msg.body?.userId,
            listingId: msg.body?.listingId,
            operation: msg.body?.operation,
          });

          return ConsumerStatus.ACK;
        } catch (error) {
          console.error(error);
          return ConsumerStatus.DROP;
        }
      }
    );
  }
}

export const rabbit = new RabbitMQService();
