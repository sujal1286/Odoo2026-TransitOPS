import prisma from "@Odoo2026-TransitOPS/db";

export class VehicleService {
  static async getVehicles(filters: {
    status?: string;
    type?: string;
    region?: string;
    search?: string;
  }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.region) where.region = filters.region;
    if (filters.search) {
      where.OR = [
        { registrationNumber: { contains: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async getVehicleById(id: string) {
    return await prisma.vehicle.findUnique({
      where: { id },
    });
  }

  static async getVehicleByRegNumber(registrationNumber: string) {
    return await prisma.vehicle.findUnique({
      where: { registrationNumber },
    });
  }

  static async createVehicle(data: {
    registrationNumber: string;
    name: string;
    type: string;
    maxLoadCapacity: number;
    odometer: number;
    acquisitionCost: number;
    region: string;
    status?: string;
  }) {
    return await prisma.vehicle.create({
      data,
    });
  }

  static async updateVehicle(
    id: string,
    data: {
      registrationNumber?: string;
      name?: string;
      type?: string;
      maxLoadCapacity?: number;
      odometer?: number;
      acquisitionCost?: number;
      region?: string;
      status?: string;
    }
  ) {
    return await prisma.vehicle.update({
      where: { id },
      data,
    });
  }
}
