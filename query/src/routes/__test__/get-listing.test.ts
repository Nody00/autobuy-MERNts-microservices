import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Listing } from "../../models/listing";

jest.mock("../../middleware/auth.ts", () => ({
  authMiddleware: jest.fn((res, req, next) => {
    req.user = {
      // this can be fillled in to suite implementation
      userId: "sadadsasd",
      userName: "test",
    };

    next();
  }),
}));

describe("Get listings", () => {
  // Setup test data
  const createSampleListings = async () => {
    const listings = [
      {
        userId: new mongoose.Types.ObjectId(),
        manufacturer: "Toyota",
        model: "Camry",
        yearOfProduction: 2020,
        mileage: 50000,
        firstYearOfRegistration: 2020,
        description: "Well maintained Toyota",
        price: 25000,
        category: 1,
        status: "active",
        isFeatured: true,
        negotiable: true,
        tags: ["automatic", "sedan"],
      },
      {
        userId: new mongoose.Types.ObjectId(),
        manufacturer: "Honda",
        model: "Civic",
        yearOfProduction: 2019,
        mileage: 60000,
        firstYearOfRegistration: 2019,
        description: "Well maintained Honda",
        price: 20000,
        category: 1,
        status: "active",
        isFeatured: false,
        negotiable: false,
        tags: ["manual", "sedan"],
      },
      {
        userId: new mongoose.Types.ObjectId(),
        manufacturer: "BMW",
        model: "X5",
        yearOfProduction: 2021,
        mileage: 30000,
        firstYearOfRegistration: 2021,
        description: "Luxury SUV",
        price: 45000,
        category: 2,
        status: "active",
        isFeatured: true,
        negotiable: true,
        tags: ["automatic", "suv", "luxury"],
      },
    ];

    await Listing.insertMany(listings);
  };

  beforeEach(async () => {
    await Listing.deleteMany({});
    await createSampleListings();
  });

  it("returns 200 and all listings with the default pagination", async () => {
    const response = await request(app).get("/query/listing").expect(200);

    expect(response.status).toBe(200);
    expect(response.body.data.listings.length).toBe(3);
    expect(response.body.data.pagination).toEqual({
      total: 3,
      page: 1,
      pages: 1,
      limit: 10,
    });
  });

  it("filters by manufacturer", async () => {
    const response = await request(app)
      .get("/query/listing?manufacturer=toyota")
      .expect(200);

    expect(response.body.data.listings.length).toBe(1);
    expect(response.body.data.listings[0].manufacturer).toBe("Toyota");
  });

  it("filters by price range", async () => {
    const response = await request(app)
      .get("/query/listing?priceMin=22000&priceMax=30000")
      .expect(200);

    expect(response.body.data.listings.length).toBe(1);
    expect(response.body.data.listings[0].price).toBe(25000);
  });

  it("filters by year range", async () => {
    const response = await request(app)
      .get("/query/listing?yearFrom=2020&yearTo=2021")
      .expect(200);

    expect(response.body.data.listings.length).toBe(2);
  });

  it("filters by category", async () => {
    const response = await request(app)
      .get("/query/listing?category=1")
      .expect(200);

    expect(response.body.data.listings.length).toBe(2);
  });

  it("filters by featured status", async () => {
    const response = await request(app)
      .get("/query/listing?isFeatured=true")
      .expect(200);

    expect(response.body.data.listings.length).toBe(2);
    expect(
      response.body.data.listings.every((listing: any) => listing.isFeatured)
    ).toBe(true);
  });

  it("filters by tags", async () => {
    const response = await request(app)
      .get("/query/listing?tags=automatic,luxury")
      .expect(200);

    expect(response.body.data.listings.length).toBe(2);
  });

  it("sorts by price in ascending order", async () => {
    const response = await request(app)
      .get("/query/listing?sortBy=price&sortOrder=asc")
      .expect(200);

    const prices = response.body.data.listings.map(
      (listing: any) => listing.price
    );

    expect(prices).toEqual([20000, 25000, 45000]);
  });

  it("handles pagination correctly", async () => {
    const response = await request(app)
      .get("/query/listing?page=1&limit=2")
      .expect(200);

    expect(response.body.data.listings.length).toBe(2);
    expect(response.body.data.pagination).toEqual({
      total: 3,
      page: 1,
      pages: 2,
      limit: 2,
    });
  });

  it("handles invalid query parameters gracefully", async () => {
    const response = await request(app).get("/query/listing?yearFrom=invalid");

    expect(response.status).toBe(400);
  });

  // Clean up after tests
  afterAll(async () => {
    await Listing.deleteMany({});
  });
});
