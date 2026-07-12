import prisma from "@Odoo2026-TransitOPS/db";

export class MaintenanceService {
  static async getLogs() {
    return await prisma.maintenanceLog.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getLogById(id: string) {
    return await prisma.maintenanceLog.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  }

  static async createMaintenance(data: {
    vehicleId: string;
    description: string;
    cost: number;
    startDate?: Date;
  }) {
    return await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: data.vehicleId },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found. Please select a valid vehicle.");
      }

      if (vehicle.status === "Retired") {
        throw new Error("Cannot initiate maintenance. This vehicle has been retired.");
      }

      if (vehicle.status === "On Trip") {
        throw new Error("Cannot initiate maintenance. This vehicle is currently dispatched on an active trip.");
      }

      // Create maintenance log
      const log = await tx.maintenanceLog.create({
        data: {
          vehicleId: data.vehicleId,
          description: data.description,
          cost: data.cost,
          startDate: data.startDate || new Date(),
          status: "Active",
        },
        include: { vehicle: true },
      });

      // Transition vehicle to In Shop
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: "In Shop" },
      });

      // Automatically register a maintenance expense to track cost aggregations
      if (data.cost > 0) {
        await tx.expense.create({
          data: {
            vehicleId: data.vehicleId,
            amount: data.cost,
            category: "Maintenance",
            description: `Maintenance Log: ${data.description}`,
            date: data.startDate || new Date(),
          },
        });
      }

      return log;
    });
  }

  static async closeMaintenance(id: string, endDate?: Date) {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.findUnique({
        where: { id },
        include: { vehicle: true },
      });

      if (!log) {
        throw new Error("Maintenance record not found.");
      }

      if (log.status === "Closed") {
        throw new Error("This maintenance log is already closed.");
      }

      // Close the maintenance log
      const updatedLog = await tx.maintenanceLog.update({
        where: { id },
        data: {
          status: "Closed",
          endDate: endDate || new Date(),
        },
        include: { vehicle: true },
      });

      // Transition vehicle back to Available, unless it is Retired
      if (log.vehicle.status !== "Retired") {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: "Available" },
        });
      }

      return updatedLog;
    });
  }
}
