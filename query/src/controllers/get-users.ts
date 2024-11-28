// controllers/user.controller.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import mongoose from "mongoose";

interface QueryParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isAdmin?: boolean;
  isCustomer?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllUsersController = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      emailVerified,
      phoneVerified,
      isAdmin,
      isCustomer,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build match stage
    const matchStage: any = { deleted: { $ne: true } };
    if (email) matchStage.email = { $regex: email, $options: "i" };
    if (firstName) matchStage.firstName = { $regex: firstName, $options: "i" };
    if (lastName) matchStage.lastName = { $regex: lastName, $options: "i" };
    if (phoneNumber)
      matchStage.phoneNumber = { $regex: phoneNumber, $options: "i" };
    if (emailVerified !== undefined) matchStage.emailVerified = emailVerified;
    if (phoneVerified !== undefined) matchStage.phoneVerified = phoneVerified;
    if (isAdmin !== undefined) matchStage.isAdmin = isAdmin;
    if (isCustomer !== undefined) matchStage.isCustomer = isCustomer;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline = [
      // Initial match stage for filtering
      { $match: matchStage },

      // Lookup saves (bookmarks)
      {
        $lookup: {
          from: "listings",
          localField: "saves",
          foreignField: "_id",
          as: "saves",
        },
      },

      // Lookup role
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },

      // Unwind role array (since it's a single document)
      {
        $unwind: {
          path: "$roleData",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Project stage to shape the output
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          recoveryPhoneNumber: 1,
          recoveryEmail: 1,
          emailVerified: 1,
          phoneVerified: 1,
          saves: 1,
          role: {
            _id: "$roleData._id",
            name: "$roleData.name",
            permissions: "$roleData.permissions",
          },
          isAdmin: 1,
          isCustomer: 1,
          version: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },

      // Sort stage
      {
        $sort: {
          [sortBy]: sortOrder === "desc" ? -1 : 1,
        },
      },

      // Facet stage for pagination
      {
        $facet: {
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                currentPage: page,
                perPage: limit,
                totalPages: {
                  $ceil: {
                    $divide: ["$total", limit],
                  },
                },
                hasNext: {
                  $lt: [{ $multiply: [page, limit] }, "$total"],
                },
                hasPrev: {
                  $gt: [page, 1],
                },
              },
            },
          ],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    // @ts-ignore
    const [result] = await User.aggregate(pipeline);

    // Format the response
    const response = {
      success: true,
      data: result.data,
      pagination: result.metadata[0] || {
        total: 0,
        currentPage: page,
        perPage: limit,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
