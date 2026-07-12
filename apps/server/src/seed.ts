import prisma from "@Odoo2026-TransitOPS/db";
import { auth } from "@Odoo2026-TransitOPS/auth";

async function main() {
  console.log("🧹 Cleaning up existing database records...");

  // Delete records in reverse dependency order
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("👥 Creating user roles via Better Auth...");

  const users = [
    {
      email: "manager@transitops.com",
      password: "Password123!",
      name: "Fleet Manager User",
      role: "FLEET_MANAGER",
    },
    {
      email: "dispatcher@transitops.com",
      password: "Password123!",
      name: "Dispatcher User",
      role: "DISPATCHER",
    },
    {
      email: "driver@transitops.com",
      password: "Password123!",
      name: "Driver User",
      role: "DRIVER",
    },
    {
      email: "safety@transitops.com",
      password: "Password123!",
      name: "Safety Officer User",
      role: "SAFETY_OFFICER",
    },
    {
      email: "finance@transitops.com",
      password: "Password123!",
      name: "Financial Analyst User",
      role: "FINANCIAL_ANALYST",
    },
  ];

  for (const userData of users) {
    try {
      await auth.api.signUpEmail({
        body: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
        },
      });
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    } catch (error: any) {
      console.error(`❌ Failed to create user ${userData.email}:`, error.message);
    }
  }

  console.log("🚚 Seeding vehicles registry...");

  const v1 = await prisma.vehicle.create({
    data: {
      registrationNumber: "NY-9021-A",
      name: "Volvo FH16 Semi-Truck",
      type: "Heavy Truck",
      maxLoadCapacity: 25000,
      odometer: 12500,
      acquisitionCost: 120000,
      status: "Available",
      region: "North",
    },
  });

  const v2 = await prisma.vehicle.create({
    data: {
      registrationNumber: "CA-4032-B",
      name: "Ford Transit Delivery Van",
      type: "Van",
      maxLoadCapacity: 3500,
      odometer: 48200,
      acquisitionCost: 45000,
      status: "Available",
      region: "West",
    },
  });

  const v3 = await prisma.vehicle.create({
    data: {
      registrationNumber: "TX-8041-C",
      name: "Isuzu NPR Flatbed Truck",
      type: "Medium Truck",
      maxLoadCapacity: 8000,
      odometer: 32000,
      acquisitionCost: 65000,
      status: "In Shop",
      region: "South",
    },
  });

  const v4 = await prisma.vehicle.create({
    data: {
      registrationNumber: "FL-1052-D",
      name: "Hino 268 Box Truck",
      type: "Medium Truck",
      maxLoadCapacity: 12000,
      odometer: 85000,
      acquisitionCost: 80000,
      status: "On Trip",
      region: "East",
    },
  });

  console.log("🧑‍✈️ Seeding drivers registry...");

  const d1 = await prisma.driver.create({
    data: {
      name: "John Doe",
      licenseNumber: "DL-908123",
      licenseCategory: "Class A",
      licenseExpiryDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000), // 2 years from now
      contactNumber: "+1-555-0199",
      safetyScore: 98.5,
      status: "Available",
    },
  });

  const d2 = await prisma.driver.create({
    data: {
      name: "Jane Smith",
      licenseNumber: "DL-402931",
      licenseCategory: "Class B",
      licenseExpiryDate: new Date(Date.now() + 365 * 1.5 * 24 * 60 * 60 * 1000), // 1.5 years from now
      contactNumber: "+1-555-0188",
      safetyScore: 95.0,
      status: "Available",
    },
  });

  const d3 = await prisma.driver.create({
    data: {
      name: "Bob Johnson",
      licenseNumber: "DL-802194",
      licenseCategory: "Class C",
      licenseExpiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      contactNumber: "+1-555-0177",
      safetyScore: 88.0,
      status: "On Trip",
    },
  });

  await prisma.driver.create({
    data: {
      name: "Alice Brown",
      licenseNumber: "DL-105284",
      licenseCategory: "Class A",
      licenseExpiryDate: new Date(Date.now() + 365 * 3 * 24 * 60 * 60 * 1000), // 3 years from now
      contactNumber: "+1-555-0166",
      safetyScore: 100.0,
      status: "Off Duty",
    },
  });

  console.log("🗺️ Seeding transport trips...");

  // Draft trip
  await prisma.trip.create({
    data: {
      source: "New York",
      destination: "Boston",
      vehicleId: v1.id,
      driverId: d1.id,
      cargoWeight: 15000,
      plannedDistance: 220,
      revenue: 1200,
      status: "Draft",
    },
  });

  // Dispatched trip
  await prisma.trip.create({
    data: {
      source: "Miami",
      destination: "Orlando",
      vehicleId: v4.id,
      driverId: d3.id,
      cargoWeight: 5000,
      plannedDistance: 235,
      revenue: 950,
      status: "Dispatched",
      startOdometer: 85000,
    },
  });

  // Completed trip
  const completedTrip = await prisma.trip.create({
    data: {
      source: "Los Angeles",
      destination: "San Francisco",
      vehicleId: v2.id,
      driverId: d2.id,
      cargoWeight: 2000,
      plannedDistance: 380,
      revenue: 1500,
      status: "Completed",
      startOdometer: 47820,
      endOdometer: 48200,
    },
  });

  console.log("🔧 Seeding maintenance history logs...");

  // Active maintenance
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: v3.id,
      description: "Routine engine service and brake pad replacement",
      cost: 850,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "Active",
    },
  });

  // Closed maintenance
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: v1.id,
      description: "Tire rotation and wheel alignment",
      cost: 450,
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      endDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
      status: "Closed",
    },
  });

  console.log("⛽ Seeding fuel logs...");

  await prisma.fuelLog.create({
    data: {
      vehicleId: v1.id,
      liters: 150,
      cost: 225,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  await prisma.fuelLog.create({
    data: {
      vehicleId: v2.id,
      tripId: completedTrip.id,
      liters: 60,
      cost: 90,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  console.log("💳 Seeding operating expenses...");

  // General tolls
  await prisma.expense.create({
    data: {
      vehicleId: v1.id,
      amount: 45,
      category: "Tolls",
      description: "New York Thruway toll gates",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Trip meal allowance
  await prisma.expense.create({
    data: {
      vehicleId: v2.id,
      tripId: completedTrip.id,
      amount: 25,
      category: "Food",
      description: "Driver food allowance",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Fuel log sync expenses
  await prisma.expense.create({
    data: {
      vehicleId: v1.id,
      amount: 225,
      category: "Fuel",
      description: "Fuel purchase: 150 Liters",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.expense.create({
    data: {
      vehicleId: v2.id,
      tripId: completedTrip.id,
      amount: 90,
      category: "Fuel",
      description: "Fuel purchase: 60 Liters",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Maintenance cost sync expenses
  await prisma.expense.create({
    data: {
      vehicleId: v3.id,
      amount: 850,
      category: "Maintenance",
      description: "Maintenance Log: Routine engine service and brake pad replacement",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.expense.create({
    data: {
      vehicleId: v1.id,
      amount: 450,
      category: "Maintenance",
      description: "Maintenance Log: Tire rotation and wheel alignment",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("🌱 Database seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
