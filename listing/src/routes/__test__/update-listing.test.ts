import request from "supertest";
import { app } from "../../app";
import { Listing } from "../../models/listing";
import mongoose from "mongoose";

jest.mock("../../service/RabbitMQService", () => ({
  rabbit: {
    sendMessage: jest.fn((exchange: string, topic: string, data) => {}),
    connect: jest.fn(),
    initializePublisher: jest.fn(),
  },
}));

const createListing = async () => {
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
    category: 1,
  };

  const response = await request(app)
    .post("/listings/new-listing")
    .send(newListing);

  return response.body.data;
};

describe("Update listing", () => {
  it("returns 400 status if invalid id is provided", async () => {
    const invalidId = "1212sdughs9g238032u02!!@~#!@#!@!@$!@?";

    const result = await request(app)
      .patch(`/listings/update-listing/${invalidId}`)
      .send({});

    expect(result.status).toBe(400);
  });

  it("returns 400 status if body data is invalid", async () => {
    const createdListing = await createListing();
    const newListing = { ...createdListing, manufacturer: 9999999 };

    const result = await request(app)
      .patch(`/listings/update-listing/${newListing._id}`)
      .send(newListing);

    expect(result.status).toBe(400);
  });

  it("returns 404 status if no listing is found for the provided id", async () => {
    const validId = new mongoose.Types.ObjectId();

    const result = await request(app)
      .patch(`/listings/update-listing/${validId}`)
      .send({});

    expect(result.status).toBe(404);
  });

  it("returns 204 status if a listing is successfuly updated", async () => {
    const createdListing = await createListing();
    const newListing = { ...createdListing, manufacturer: "Mercedes" };
    const result = await request(app)
      .patch(`/listings/update-listing/${newListing._id}`)
      .send(newListing);

    const foundListing = await Listing.findById(newListing._id);

    expect(foundListing?.manufacturer).toBe(newListing.manufacturer);
    expect(result.status).toBe(204);
  });
});
