import prisma from "@Odoo2026-TransitOPS/db";

export class ExpenseService {
  static async getExpenses() {
    return await prisma.expense.findMany({
      include: {
        vehicle: true,
        trip: true,
      },
      orderBy: { date: "desc" },
    });
  }

  static async createExpense(data: {
    vehicleId: string;
    tripId?: string;
    amount: number;
    category: string;
    description?: string;
    date?: Date;
  }) {
    return await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: data.vehicleId },
      });
      if (!vehicle) {
        throw new Error("Vehicle not found. Please select a valid vehicle.");
      }

      if (data.tripId) {
        const trip = await tx.trip.findUnique({
          where: { id: data.tripId },
        });
        if (!trip) {
          throw new Error("Trip not found. Please check the trip ID.");
        }
      }

      return await tx.expense.create({
        data: {
          vehicleId: data.vehicleId,
          tripId: data.tripId || null,
          amount: data.amount,
          category: data.category,
          description: data.description || null,
          date: data.date || new Date(),
        },
        include: {
          vehicle: true,
          trip: true,
        },
      });
    });
  }
}
