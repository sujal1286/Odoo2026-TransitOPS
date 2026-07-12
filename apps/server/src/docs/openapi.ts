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
        "description": "Register a new vehicle in the system. Requires FLEET_MANAGER role.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateVehicleInput" }
            }
          }
        },
        "responses": {
          "201": { "description": "Created" },
          "400": { "description": "Validation Error" },
          "409": { "description": "Duplicate Registration Number" }
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
          "200": { "description": "Success" }
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
          "201": { "description": "Created" },
          "400": { "description": "Validation Error" }
        }
      }
    },
    "/api/trips/{id}/dispatch": {
      "patch": {
        "tags": ["Trips"],
        "summary": "Dispatch Trip",
        "description": "Validates dispatch business rules and shifts trip status to Dispatched. Requires FLEET_MANAGER or DISPATCHER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The unique trip ID" }
        ],
        "responses": {
          "200": { "description": "Dispatched" },
          "400": { "description": "Business Rule/Validation Failure" },
          "404": { "description": "Trip Not Found" }
        }
      }
    },
    "/api/trips/{id}/complete": {
      "patch": {
        "tags": ["Trips"],
        "summary": "Complete Trip",
        "description": "Updates odometer, restores statuses to Available, and records fuel log details. Requires FLEET_MANAGER, DISPATCHER, or DRIVER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The unique trip ID" }
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
          "200": { "description": "Completed" },
          "400": { "description": "Business Rule/Validation Failure" },
          "404": { "description": "Trip Not Found" }
        }
      }
    },
    "/api/trips/{id}/cancel": {
      "patch": {
        "tags": ["Trips"],
        "summary": "Cancel Trip",
        "description": "Cancels a Draft or Dispatched trip and restores asset statuses to Available. Requires FLEET_MANAGER or DISPATCHER role.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" }, "description": "The unique trip ID" }
        ],
        "responses": {
          "200": { "description": "Cancelled" },
          "400": { "description": "Business Rule/Validation Failure" },
          "404": { "description": "Trip Not Found" }
        }
      }
    },
    "/api/dashboard/kpis": {
      "get": {
        "tags": ["Dashboard"],
        "summary": "Dashboard KPIs",
        "description": "Retrieve summary counts and active utilization % for the fleet manager dashboard.",
        "responses": {
          "200": { "description": "Success" }
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
      Trip: {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "source": { "type": "string" },
          "destination": { "type": "string" },
          "vehicleId": { "type": "string" },
          "driverId": { "type": "string" },
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
      }
    }
  }
};
