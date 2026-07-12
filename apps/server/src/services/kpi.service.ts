import prisma from "@Odoo2026-TransitOPS/db";

export class KpiService {
  static async getDashboardKpis() {
    const [
      totalVehicles,
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "On Trip" } }),
      prisma.vehicle.count({ where: { status: "Available" } }),
      prisma.vehicle.count({ where: { status: "In Shop" } }),
      prisma.trip.count({ where: { status: "Dispatched" } }),
      prisma.trip.count({ where: { status: "Draft" } }),
      prisma.driver.count({ where: { status: { in: ["Available", "On Trip"] } } }),
    ]);

    const fleetUtilization = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;

    return {
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization: Math.round(fleetUtilization * 10) / 10,
    };
  }
}
