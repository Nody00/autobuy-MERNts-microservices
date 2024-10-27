import request from "supertest";
import { app } from "../../app";
import { Listing } from "../../models/listing";

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
    connect: jest.fn(),
    initializePublisher: jest.fn(),
  },
}));

describe("Listing creation", () => {
  it("returns a 400 error if wrong input data is provided", async () => {
    const newListing = {
      userId: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId format
      manufacturer: 99999,
      model: "Camry",
      yearOfProduction: 2020,
      mileage: 50000,
      firstYearOfRegistration: 2020,
      description:
        "Well maintained vehicle with full service history. Features include air conditioning, power windows, and a premium sound system.",
      price: 25000,
      category: 1, // Assuming "SEDAN" is one of your CATEGORIES values
    };

    const result = await request(app)
      .post("/listings/new-listing")
      .send(newListing);

    expect(result.status).toBe(400);
  });

  it("returns a 201 status if successful and creates a listing", async () => {
    const newListing = {
      userId: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId format
      manufacturer: "Toyota",
      model: "Camry",
      yearOfProduction: 2020,
      mileage: 50000,
      firstYearOfRegistration: 2020,
      description:
        "Well maintained vehicle with full service history. Features include air conditioning, power windows, and a premium sound system.",
      price: 25000,
      category: 1, // Assuming "SEDAN" is one of your CATEGORIES values
    };

    const response = await request(app)
      .post("/listings/new-listing")
      .send(newListing);

    const createdListing = await Listing.findOne({ userId: newListing.userId });

    expect(response.status).toBe(201);
    expect(createdListing!._id).toBeDefined();
  });
});
