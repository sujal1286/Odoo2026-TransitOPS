import type { Context } from "hono";
import { TripService } from "../services/trip.service";
import { VehicleService } from "../services/vehicle.service";
import { createTripSchema, completeTripSchema } from "../schemas/trip.schema";
import { successResponse, errorResponse } from "../lib/api-response";

export class TripController {
  static async getTrips(c: Context) {
    try {
      const trips = await TripService.getTrips();
      return successResponse(c, trips);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }

  static async createTrip(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createTripSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      // Check if vehicle exists and cargo weight doesn't exceed vehicle capacity
      const vehicle = await VehicleService.getVehicleById(parsed.data.vehicleId);
      if (!vehicle) {
        return errorResponse(c, "Vehicle not found", "NOT_FOUND_ERROR", 404);
      }
      if (parsed.data.cargoWeight > vehicle.maxLoadCapacity) {
        return errorResponse(
          c,
          `Cargo weight exceeds vehicle's maximum load capacity of ${vehicle.maxLoadCapacity} kg`,
          "VALIDATION_ERROR",
          400
        );
      }

      const trip = await TripService.createTrip(parsed.data);
      return successResponse(c, trip, 201);
    } catch (err: any) {
      return errorResponse(c, err.message, "INTERNAL_ERROR", 500);
    }
  }

  static async dispatchTrip(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const trip = await TripService.dispatchTrip(id);
      return successResponse(c, trip);
    } catch (err: any) {
      // Map domain errors to clear HTTP codes
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      if (msg.includes("only Draft") || msg.includes("not available") || msg.includes("expired") || msg.includes("exceeds")) {
        return errorResponse(c, msg, "BUSINESS_RULE_ERROR", 400);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }

  static async completeTrip(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const body = await c.req.json();
      const parsed = completeTripSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      const trip = await TripService.completeTrip(id, parsed.data);
      return successResponse(c, trip);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      if (msg.includes("Only Dispatched") || msg.includes("cannot be less")) {
        return errorResponse(c, msg, "BUSINESS_RULE_ERROR", 400);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }

  static async cancelTrip(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const trip = await TripService.cancelTrip(id);
      return successResponse(c, trip);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      if (msg.includes("Only Draft or Dispatched")) {
        return errorResponse(c, msg, "BUSINESS_RULE_ERROR", 400);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }
}
