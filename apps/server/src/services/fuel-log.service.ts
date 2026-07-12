import prisma from "@Odoo2026-TransitOPS/db";

export class FuelLogService {
  static async getFuelLogs() {
    return await prisma.fuelLog.findMany({
      include: {
        vehicle: true,
        trip: true,
      },
      orderBy: { date: "desc" },
    });
  }

  static async createFuelLog(data: {
    vehicleId: string;
    tripId?: string;
    liters: number;
    cost: number;
    date?: Date;
  }) {
    return await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: data.vehicleId },
      });
      if (!vehicle) {
        throw new Error("Vehicle not found. Please provide a valid vehicle.");
      }

      if (data.tripId) {
        const trip = await tx.trip.findUnique({
          where: { id: data.tripId },
        });
        if (!trip) {
          throw new Error("Trip not found. Please verify the trip ID.");
        }
      }

      const logDate = data.date || new Date();

      // Create fuel log
      const fuelLog = await tx.fuelLog.create({
        data: {
          vehicleId: data.vehicleId,
          tripId: data.tripId || null,
          liters: data.liters,
          cost: data.cost,
          date: logDate,
        },
        include: {
          vehicle: true,
          trip: true,
        },
      });

      // Synchronize by adding a fuel expense
      await tx.expense.create({
        data: {
          vehicleId: data.vehicleId,
          tripId: data.tripId || null,
          amount: data.cost,
          category: "Fuel",
          description: `Fuel purchase: ${data.liters} Liters`,
          date: logDate,
        },
      });

      return fuelLog;
    });
  }
}
