import prisma from "@Odoo2026-TransitOPS/db";

export class DriverService {
  static async getDrivers(filters: {
    status?: string;
    search?: string;
    available?: boolean;
  }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { licenseNumber: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.available) {
      where.status = "Available";
      where.licenseExpiryDate = { gt: new Date() };
    }

    return await prisma.driver.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }

  static async getDriverById(id: string) {
    return await prisma.driver.findUnique({
      where: { id },
    });
  }

  static async getDriverByLicenseNumber(licenseNumber: string) {
    return await prisma.driver.findUnique({
      where: { licenseNumber },
    });
  }

  static async createDriver(data: {
    name: string;
    licenseNumber: string;
    licenseCategory: string;
    licenseExpiryDate: Date;
    contactNumber: string;
    safetyScore?: number;
    status?: string;
  }) {
    return await prisma.driver.create({
      data,
    });
  }

  static async updateDriver(
    id: string,
    data: {
      name?: string;
      licenseNumber?: string;
      licenseCategory?: string;
      licenseExpiryDate?: Date;
      contactNumber?: string;
      safetyScore?: number;
      status?: string;
    }
  ) {
    return await prisma.driver.update({
      where: { id },
      data,
    });
  }
}
