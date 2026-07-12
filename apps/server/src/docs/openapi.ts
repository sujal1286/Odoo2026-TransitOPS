export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "TransitOps API Reference",
    version: "1.0.0",
    description: "Documentation for TransitOps Smart Transport Operations Platform APIs.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
  tags: [
    {
      name: "Vehicles",
      description: "Operations and registry details for the fleet vehicle assets",
    },
    {
      name: "Drivers",
      description: "Operations and registry details for the driver profiles and licenses",
    },
    {
      name: "Trips",
      description: "Lifecycle, scheduling, routing, dispatching, and completion of transport trips",
    },
    {
      name: "Maintenance",
      description: "Vehicle maintenance workflows, active shop servicing, and closure updates",
    },
    {
      name: "Fuel & Expenses",
      description: "Logging of fuel replenishment and general operations expenses",
    },
    {
      name: "Reports",
      description: "Fleet performance reports, cost aggregation, and vehicle ROI analytics",
    },
    {
      name: "Dashboard",
      description: "Fleet metrics, active utilization, and status count summaries",
    },
  ],
  paths: {
    "/api/vehicles": {
      "get": {
        "tags": ["Vehicles"],
        "summary": "List Vehicles",
        "description": "Retrieve a list of vehicles in the registry with optional filters.",
        "parameters": [
          { "name": "status", "in": "query", "schema": { "type": "string" }, "description": "Filter by status: Available, On Trip, In Shop, Retired" },
          { "name": "type", "in": "query", "schema": { "type": "string" }, "description": "Filter by vehicle type" },
          { "name": "region", "in": "query", "schema": { "type": "string" }, "description": "Filter by operations region" },
          { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Search by registration number or name/model" }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Vehicle" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Vehicles"],
        "summary": "Add Vehicle",
        "description": "Register a new vehicle in the system. Requires FLEET_MANAGER or SAFETY_OFFICER role.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateVehicleInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },
    "/api/vehicles/{id}": {
      "patch": {
        "tags": ["Vehicles"],
        "summary": "Update Vehicle",
        "description": "Modify details of an existing vehicle. Requires FLEET_MANAGER or SAFETY_OFFICER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The unique vehicle ID" }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/UpdateVehicleInput" }
            }
          }
        },
        "responses": {
          "200": { "description": "Updated" },
          "400": { "description": "Validation Error" },
          "404": { "description": "Vehicle Not Found" },
          "409": { "description": "Registration Number Conflict" }
        }
      }
    },
    "/api/drivers": {
      "get": {
        "tags": ["Drivers"],
        "summary": "List Drivers",
        "description": "Retrieve a list of driver profiles.",
        "parameters": [
          { "name": "status", "in": "query", "schema": { "type": "string" }, "description": "Filter by status: Available, On Trip, Off Duty, Suspended" },
          { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Search by name or license number" },
          { "name": "available", "in": "query", "schema": { "type": "string" }, "description": "Filter available and unexpired drivers if set to true" }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Driver" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Drivers"],
        "summary": "Add Driver",
        "description": "Register a new driver. Requires FLEET_MANAGER or SAFETY_OFFICER roles.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateDriverInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },
    "/api/drivers/{id}": {
      "patch": {
        "tags": ["Drivers"],
        "summary": "Update Driver",
        "description": "Modify details of an existing driver. Requires FLEET_MANAGER or SAFETY_OFFICER roles.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The unique driver ID" }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/UpdateDriverInput" }
            }
          }
        },
        "responses": {
          "200": { "description": "Updated" },
          "400": { "description": "Validation Error" },
          "404": { "description": "Driver Not Found" },
          "409": { "description": "License Number Conflict" }
        }
      }
    },
    "/api/trips": {
      "get": {
        "tags": ["Trips"],
        "summary": "List Trips",
        "description": "Retrieve a list of transport trips.",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Trip" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Trips"],
        "summary": "Create Trip (Draft)",
        "description": "Register a new trip in Draft state. Requires FLEET_MANAGER or DISPATCHER role.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateTripInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Created" }
        }
      }
    },
    "/api/trips/{id}/dispatch": {
      "patch": {
        "tags": ["Trips"],
        "summary": "Dispatch Trip",
        "description": "Validates dispatch business rules and shifts trip status to Dispatched. Requires FLEET_MANAGER or DISPATCHER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Dispatched" }
        }
      }
    },
    "/api/trips/{id}/complete": {
      "patch": {
        "tags": ["Trips"],
        "summary": "Complete Trip",
        "description": "Updates odometer, restores statuses to Available, and records fuel log details. Requires FLEET_MANAGER, DISPATCHER, or DRIVER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CompleteTripInput" }
            }
          }
        },
        "responses": {
          "200": { "description": "Completed" }
        }
      }
    },
    "/api/trips/{id}/cancel": {
      "patch": {
        "tags": ["Trips"],
        "summary": "Cancel Trip",
        "description": "Cancels a Draft or Dispatched trip and restores asset statuses to Available. Requires FLEET_MANAGER or DISPATCHER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "Cancelled" }
        }
      }
    },
    "/api/maintenance": {
      "get": {
        "tags": ["Maintenance"],
        "summary": "List Maintenance Logs",
        "description": "Retrieve all vehicle servicing history and active logs.",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/MaintenanceLog" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Maintenance"],
        "summary": "Initiate Maintenance",
        "description": "Places a vehicle into maintenance. Updates status to In Shop and tracks cost. Requires FLEET_MANAGER role.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateMaintenanceInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Initiated" },
          "400": { "description": "Business Rule/Validation Failure" }
        }
      }
    },
    "/api/maintenance/{id}/close": {
      "patch": {
        "tags": ["Maintenance"],
        "summary": "Close Maintenance",
        "description": "Closes a vehicle servicing log and returns the vehicle to Available. Requires FLEET_MANAGER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CloseMaintenanceInput" }
            }
          }
        },
        "responses": {
          "200": { "description": "Closed" }
        }
      }
    },
    "/api/fuel-logs": {
      "get": {
        "tags": ["Fuel & Expenses"],
        "summary": "List Fuel Logs",
        "description": "Retrieve all fuel purchase history records.",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/FuelLog" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Fuel & Expenses"],
        "summary": "Log Fuel Replenishment",
        "description": "Log fuel liters and cost, auto-generating a matching operational expense.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateFuelLogInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Logged" }
        }
      }
    },
    "/api/expenses": {
      "get": {
        "tags": ["Fuel & Expenses"],
        "summary": "List Expenses",
        "description": "Retrieve list of all operating expenses (Fuel, Maintenance, Tolls, Food, etc.).",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Expense" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Fuel & Expenses"],
        "summary": "Create Expense",
        "description": "Register an operating expense. Requires FINANCIAL_ANALYST role.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateExpenseInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Registered" }
        }
      }
    },
    "/api/reports/analytics": {
      "get": {
        "tags": ["Reports"],
        "summary": "Vehicle Performance Reports",
        "description": "Aggregate per-vehicle statistics including distance, revenue, fuel efficiency, operational costs, and vehicle ROI. Requires FLEET_MANAGER or FINANCIAL_ANALYST role.",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/VehicleAnalytics" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/dashboard/kpis": {
      "get": {
        "tags": ["Dashboard"],
        "summary": "Dashboard KPIs",
        "description": "Retrieve summary counts and active utilization % for the fleet manager dashboard.",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": { "$ref": "#/components/schemas/DashboardKpis" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Vehicle: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "registrationNumber": { "type": "string" },
          "name": { "type": "string" },
          "type": { "type": "string" },
          "maxLoadCapacity": { "type": "number" },
          "odometer": { "type": "number" },
          "acquisitionCost": { "type": "number" },
          "status": { "type": "string" },
          "region": { "type": "string" }
        }
      },
      CreateVehicleInput: {
        "type": "object",
        "required": ["registrationNumber", "name", "type", "maxLoadCapacity", "odometer", "acquisitionCost", "region"],
        "properties": {
          "registrationNumber": { "type": "string" },
          "name": { "type": "string" },
          "type": { "type": "string" },
          "maxLoadCapacity": { "type": "number" },
          "odometer": { "type": "number" },
          "acquisitionCost": { "type": "number" },
          "region": { "type": "string" },
          "status": { "type": "string", "enum": ["Available", "On Trip", "In Shop", "Retired"] }
        }
      },
      UpdateVehicleInput: {
        "type": "object",
        "properties": {
          "registrationNumber": { "type": "string" },
          "name": { "type": "string" },
          "type": { "type": "string" },
          "maxLoadCapacity": { "type": "number" },
          "odometer": { "type": "number" },
          "acquisitionCost": { "type": "number" },
          "region": { "type": "string" },
          "status": { "type": "string", "enum": ["Available", "On Trip", "In Shop", "Retired"] }
        }
      },
      Driver: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "licenseNumber": { "type": "string" },
          "licenseCategory": { "type": "string" },
          "licenseExpiryDate": { "type": "string", "format": "date-time" },
          "contactNumber": { "type": "string" },
          "safetyScore": { "type": "number" },
          "status": { "type": "string" }
        }
      },
      CreateDriverInput: {
        "type": "object",
        "required": ["name", "licenseNumber", "licenseCategory", "licenseExpiryDate", "contactNumber"],
        "properties": {
          "name": { "type": "string" },
          "licenseNumber": { "type": "string" },
          "licenseCategory": { "type": "string" },
          "licenseExpiryDate": { "type": "string", "format": "date" },
          "contactNumber": { "type": "string" },
          "safetyScore": { "type": "number" },
          "status": { "type": "string", "enum": ["Available", "On Trip", "Off Duty", "Suspended"] }
        }
      },
      UpdateDriverInput: {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "licenseNumber": { "type": "string" },
          "licenseCategory": { "type": "string" },
          "licenseExpiryDate": { "type": "string", "format": "date" },
          "contactNumber": { "type": "string" },
          "safetyScore": { "type": "number" },
          "status": { "type": "string", "enum": ["Available", "On Trip", "Off Duty", "Suspended"] }
        }
      },
      Trip: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "source": { "type": "string" },
          "destination": { "type": "string" },
          "vehicleId": { "type": "string" },
          "vehicle": { "$ref": "#/components/schemas/Vehicle" },
          "driverId": { "type": "string" },
          "driver": { "$ref": "#/components/schemas/Driver" },
          "cargoWeight": { "type": "number" },
          "plannedDistance": { "type": "number" },
          "revenue": { "type": "number" },
          "status": { "type": "string" },
          "startOdometer": { "type": "number" },
          "endOdometer": { "type": "number" }
        }
      },
      CreateTripInput: {
        "type": "object",
        "required": ["source", "destination", "vehicleId", "driverId", "cargoWeight", "plannedDistance"],
        "properties": {
          "source": { "type": "string" },
          "destination": { "type": "string" },
          "vehicleId": { "type": "string" },
          "driverId": { "type": "string" },
          "cargoWeight": { "type": "number" },
          "plannedDistance": { "type": "number" },
          "revenue": { "type": "number" }
        }
      },
      CompleteTripInput: {
        "type": "object",
        "required": ["endOdometer"],
        "properties": {
          "endOdometer": { "type": "number" },
          "fuelLiters": { "type": "number" },
          "fuelCost": { "type": "number" }
        }
      },
      MaintenanceLog: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "vehicleId": { "type": "string" },
          "vehicle": { "$ref": "#/components/schemas/Vehicle" },
          "description": { "type": "string" },
          "cost": { "type": "number" },
          "startDate": { "type": "string", "format": "date-time" },
          "endDate": { "type": "string", "format": "date-time" },
          "status": { "type": "string" }
        }
      },
      CreateMaintenanceInput: {
        "type": "object",
        "required": ["vehicleId", "description", "cost"],
        "properties": {
          "vehicleId": { "type": "string" },
          "description": { "type": "string" },
          "cost": { "type": "number" },
          "startDate": { "type": "string", "format": "date-time" }
        }
      },
      CloseMaintenanceInput: {
        "type": "object",
        "properties": {
          "endDate": { "type": "string", "format": "date-time" }
        }
      },
      FuelLog: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "vehicleId": { "type": "string" },
          "vehicle": { "$ref": "#/components/schemas/Vehicle" },
          "tripId": { "type": "string" },
          "trip": { "$ref": "#/components/schemas/Trip" },
          "liters": { "type": "number" },
          "cost": { "type": "number" },
          "date": { "type": "string", "format": "date-time" }
        }
      },
      CreateFuelLogInput: {
        "type": "object",
        "required": ["vehicleId", "liters", "cost"],
        "properties": {
          "vehicleId": { "type": "string" },
          "tripId": { "type": "string" },
          "liters": { "type": "number" },
          "cost": { "type": "number" },
          "date": { "type": "string", "format": "date-time" }
        }
      },
      Expense: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "vehicleId": { "type": "string" },
          "vehicle": { "$ref": "#/components/schemas/Vehicle" },
          "tripId": { "type": "string" },
          "trip": { "$ref": "#/components/schemas/Trip" },
          "amount": { "type": "number" },
          "category": { "type": "string" },
          "description": { "type": "string" },
          "date": { "type": "string", "format": "date-time" }
        }
      },
      CreateExpenseInput: {
        "type": "object",
        "required": ["vehicleId", "amount", "category"],
        "properties": {
          "vehicleId": { "type": "string" },
          "tripId": { "type": "string" },
          "amount": { "type": "number" },
          "category": { "type": "string", "enum": ["Tolls", "Food", "Maintenance", "Fuel", "Other"] },
          "description": { "type": "string" },
          "date": { "type": "string", "format": "date-time" }
        }
      },
      VehicleAnalytics: {
        "type": "object",
        "properties": {
          "vehicleId": { "type": "string" },
          "registrationNumber": { "type": "string" },
          "name": { "type": "string" },
          "type": { "type": "string" },
          "acquisitionCost": { "type": "number" },
          "totalDistance": { "type": "number" },
          "totalRevenue": { "type": "number" },
          "totalLiters": { "type": "number" },
          "fuelCost": { "type": "number" },
          "maintenanceCost": { "type": "number" },
          "tollsCost": { "type": "number" },
          "fuelEfficiency": { "type": "number" },
          "totalOperationalCost": { "type": "number" },
          "vehicleRoi": { "type": "number" }
        }
      },
      DashboardKpis: {
        "type": "object",
        "properties": {
          "activeVehicles": { "type": "number" },
          "availableVehicles": { "type": "number" },
          "maintenanceVehicles": { "type": "number" },
          "activeTrips": { "type": "number" },
          "pendingTrips": { "type": "number" },
          "driversOnDuty": { "type": "number" },
          "fleetUtilization": { "type": "number" }
        }
      }
    }
  }
};
