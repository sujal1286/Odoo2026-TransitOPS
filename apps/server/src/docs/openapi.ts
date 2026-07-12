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
      }
    }
  }
};
