import prisma from "@Odoo2026-TransitOPS/db";

export class ReportService {
  static async getVehicleAnalytics() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: {
          where: { status: "Completed" },
        },
        fuelLogs: true,
        maintenanceLogs: true,
        expenses: true,
      },
    });

    return vehicles.map((vehicle) => {
      const completedTrips = vehicle.trips;
      const totalDistance = completedTrips.reduce((acc, t) => acc + t.plannedDistance, 0);
      const totalRevenue = completedTrips.reduce((acc, t) => acc + t.revenue, 0);

      const totalLiters = vehicle.fuelLogs.reduce((acc, f) => acc + f.liters, 0);
      const fuelCost = vehicle.fuelLogs.reduce((acc, f) => acc + f.cost, 0);
      const maintenanceCost = vehicle.maintenanceLogs.reduce((acc, m) => acc + m.cost, 0);

      // Extract tolls from the expenses relation
      const tollsCost = vehicle.expenses
        .filter((e) => e.category === "Tolls")
        .reduce((acc, e) => acc + e.amount, 0);

      // Fuel Efficiency (planned distance / total liters)
      const fuelEfficiency = totalLiters > 0 ? totalDistance / totalLiters : 0;

      // Total Operational Cost (fuel + maintenance + tolls)
      const totalOperationalCost = fuelCost + maintenanceCost + tollsCost;

      // Vehicle ROI: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
      const vehicleRoi =
        vehicle.acquisitionCost > 0
          ? (totalRevenue - (maintenanceCost + fuelCost)) / vehicle.acquisitionCost
          : 0;

      return {
        vehicleId: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        type: vehicle.type,
        acquisitionCost: vehicle.acquisitionCost,
        totalDistance,
        totalRevenue,
        totalLiters,
        fuelCost,
        maintenanceCost,
        tollsCost,
        fuelEfficiency,
        totalOperationalCost,
        vehicleRoi,
      };
    });
  }
}
