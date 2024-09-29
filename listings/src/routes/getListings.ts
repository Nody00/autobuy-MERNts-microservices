import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

const fakeData = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 15000,
    mileage: 45000,
    location: "Los Angeles, CA",
    color: "Blue",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Well-maintained Toyota Corolla with excellent fuel economy and a smooth ride.",
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2020,
    price: 18000,
    mileage: 32000,
    location: "New York, NY",
    color: "Black",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Sporty Honda Civic with a sleek design and modern features, perfect for city driving.",
  },
  {
    id: 3,
    make: "Ford",
    model: "Mustang",
    year: 2019,
    price: 25000,
    mileage: 22000,
    location: "Austin, TX",
    color: "Red",
    transmission: "Manual",
    fuelType: "Gasoline",
    description:
      "Powerful Ford Mustang with a manual transmission, offering an exhilarating driving experience.",
  },
  {
    id: 4,
    make: "Tesla",
    model: "Model 3",
    year: 2021,
    price: 40000,
    mileage: 15000,
    location: "San Francisco, CA",
    color: "White",
    transmission: "Automatic",
    fuelType: "Electric",
    description:
      "Tesla Model 3 with autopilot features and a long-range battery, ideal for tech enthusiasts.",
  },
  {
    id: 5,
    make: "Chevrolet",
    model: "Camaro",
    year: 2017,
    price: 22000,
    mileage: 50000,
    location: "Miami, FL",
    color: "Yellow",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Chevrolet Camaro in striking yellow, offering a combination of style and performance.",
  },
  {
    id: 6,
    make: "BMW",
    model: "X5",
    year: 2018,
    price: 35000,
    mileage: 40000,
    location: "Chicago, IL",
    color: "Silver",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Luxury BMW X5 SUV with all-wheel drive and premium interior features.",
  },
  {
    id: 7,
    make: "Audi",
    model: "A4",
    year: 2019,
    price: 28000,
    mileage: 30000,
    location: "Seattle, WA",
    color: "Gray",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Elegant Audi A4 with advanced safety features and a comfortable ride.",
  },
  {
    id: 8,
    make: "Jeep",
    model: "Wrangler",
    year: 2020,
    price: 32000,
    mileage: 20000,
    location: "Denver, CO",
    color: "Green",
    transmission: "Manual",
    fuelType: "Gasoline",
    description:
      "Jeep Wrangler with off-road capabilities, perfect for adventure enthusiasts.",
  },
  {
    id: 9,
    make: "Hyundai",
    model: "Elantra",
    year: 2021,
    price: 17000,
    mileage: 10000,
    location: "Orlando, FL",
    color: "Blue",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Hyundai Elantra with a modern design and advanced technology features.",
  },
  {
    id: 10,
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2019,
    price: 37000,
    mileage: 25000,
    location: "Atlanta, GA",
    color: "White",
    transmission: "Automatic",
    fuelType: "Gasoline",
    description:
      "Luxurious Mercedes-Benz C-Class sedan with premium amenities and superior performance.",
  },
];

router.get("/get", (req: Request, res: Response) => {
  res.send({ listings: fakeData });
});

export { router as getListingsRoute };
