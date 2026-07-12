import prisma from "@Odoo2026-TransitOPS/db";

export class TripService {
  static async getTrips() {
    return await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTripById(id: string) {
    return await prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
      },
    });
  }

  static async createTrip(data: {
    source: string;
    destination: string;
    vehicleId: string;
    driverId: string;
    cargoWeight: number;
    plannedDistance: number;
    revenue: number;
  }) {
    return await prisma.trip.create({
      data: {
        ...data,
        status: "Draft",
      },
      include: {
        vehicle: true,
        driver: true,
      },
    });
  }

  static async dispatchTrip(id: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id },
        include: { vehicle: true, driver: true },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }
      if (trip.status !== "Draft") {
        throw new Error("Only Draft trips can be dispatched");
      }

      // 1. Vehicle must be Available
      if (trip.vehicle.status !== "Available") {
        throw new Error(`Vehicle is not available (Current status: ${trip.vehicle.status})`);
      }

      // 2. Driver must be Available
      if (trip.driver.status !== "Available") {
        throw new Error(`Driver is not available (Current status: ${trip.driver.status})`);
      }

      // 3. Driver license must not be expired
      if (new Date(trip.driver.licenseExpiryDate) <= new Date()) {
        throw new Error("Driver driving license is expired");
      }

      // 4. Cargo weight must not exceed vehicle load capacity
      if (trip.cargoWeight > trip.vehicle.maxLoadCapacity) {
        throw new Error(
          `Cargo weight (${trip.cargoWeight} kg) exceeds vehicle maximum capacity (${trip.vehicle.maxLoadCapacity} kg)`
        );
      }

      // Update vehicle status
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: "On Trip" },
      });

      // Update driver status
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: "On Trip" },
      });

      // Update trip details
      return await tx.trip.update({
        where: { id },
        data: {
          status: "Dispatched",
          startOdometer: trip.vehicle.odometer,
        },
        include: {
          vehicle: true,
          driver: true,
        },
      });
    });
  }

  static async completeTrip(
    id: string,
    data: {
      endOdometer: number;
      fuelLiters?: number;
      fuelCost?: number;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id },
        include: { vehicle: true },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }
      if (trip.status !== "Dispatched") {
        throw new Error("Only Dispatched trips can be completed");
      }

      // Validate end odometer is not less than start odometer
      if (data.endOdometer < trip.vehicle.odometer) {
        throw new Error(
          `End odometer (${data.endOdometer}) cannot be less than vehicle starting odometer (${trip.vehicle.odometer})`
        );
      }

      // 1. Update vehicle status and odometer
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: "Available",
          odometer: data.endOdometer,
        },
      });

      // 2. Update driver status to Available
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: "Available" },
      });

      // 3. If fuel details are entered, log fuel and expense
      if (data.fuelLiters && data.fuelCost) {
        await tx.fuelLog.create({
          data: {
            vehicleId: trip.vehicleId,
            tripId: trip.id,
            liters: data.fuelLiters,
            cost: data.fuelCost,
            date: new Date(),
          },
        });

        await tx.expense.create({
          data: {
            vehicleId: trip.vehicleId,
            tripId: trip.id,
            amount: data.fuelCost,
            category: "Fuel",
            description: `Fuel for completed trip ${trip.source} -> ${trip.destination}`,
            date: new Date(),
          },
        });
      }

      // 4. Update trip details
      return await tx.trip.update({
        where: { id },
        data: {
          status: "Completed",
          endOdometer: data.endOdometer,
        },
        include: {
          vehicle: true,
          driver: true,
        },
      });
    });
  }

  static async cancelTrip(id: string) {
    return await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }
      if (trip.status !== "Draft" && trip.status !== "Dispatched") {
        throw new Error("Only Draft or Dispatched trips can be cancelled");
      }

      // Revert vehicle and driver status back to Available
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: "Available" },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: "Available" },
      });

      // Update trip status to Cancelled
      return await tx.trip.update({
        where: { id },
        data: { status: "Cancelled" },
        include: {
          vehicle: true,
          driver: true,
        },
      });
    });
  }
}
