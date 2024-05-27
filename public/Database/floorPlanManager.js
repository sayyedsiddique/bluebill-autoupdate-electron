const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getFloorPlanTableList = (floorId) => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS floorPlan (
          floorPlanId INTEGER PRIMARY KEY,
          floorId INTEGER,
          tableId INTEGER,
          isDeleted INTEGER,
          isSync INTEGER,
          lastUpdate INTEGER,
          storeId INTEGER,
          tableName TEXT,
          transform TEXT,
          width INTEGER,
          seatingCapacityCount INTEGER,
          borderRadius TEXT,
          height INTEGER
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM floorPlan WHERE floorId = ?";
    const readQuery = db.prepare(query);
    const floorPlanTables = readQuery.all(floorId);
    console.log("floorPlanTables... ", floorPlanTables);
    return floorPlanTables;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertFloorPlanTable = (floorPlanObj) => {
  console.log("InsertfloorPlanObj... ", floorPlanObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS floorPlan (
          floorPlanId INTEGER PRIMARY KEY,
          floorId INTEGER,
          tableId INTEGER,
          isDeleted INTEGER,
          isSync INTEGER,
          lastUpdate INTEGER,
          storeId INTEGER,
          tableName TEXT,
          transform TEXT,
          width INTEGER,
          seatingCapacityCount INTEGER,
          borderRadius TEXT,
          height INTEGER
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      "INSERT INTO floorPlan (floorPlanId, floorId, tableId, isDeleted, isSync, lastUpdate, storeId, tableName, transform, width, seatingCapacityCount, borderRadius, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run(
        floorPlanObj?.floorPlanId,
        floorPlanObj?.floorId,
        floorPlanObj?.tableId,
        floorPlanObj?.isDeleted,
        floorPlanObj?.isSync,
        floorPlanObj?.lastUpdate,
        floorPlanObj?.storeId,
        floorPlanObj?.tableName,
        floorPlanObj?.transform,
        floorPlanObj?.width,
        floorPlanObj?.seatingCapacityCount,
        floorPlanObj?.borderRadius,
        floorPlanObj?.height
      );
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into floorPlan`
      );

      if (result.changes === 1) {
        console.log("FloorPlan inserted successfully!");
        return result;
      } else {
        console.error("Error adding floorPlan.");
      }
    });
    transaction();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateFloorPlanTableById = (floorPlanObj) => {
  console.log("updatefloorPlanObj... ", floorPlanObj);
  try {
    const updateQuery = db.prepare(
      "UPDATE floorPlan SET floorPlanId = ?, isDeleted = ?, isSync = ?, lastUpdate = ?, storeId = ?, tableName = ?, transform = ?, width = ?, seatingCapacityCount = ?, borderRadius = ?, height = ? WHERE floorId = ? AND tableId = ?"
    );
    let result;
    result = updateQuery.run(
      floorPlanObj?.floorPlanId,
      floorPlanObj?.isDeleted,
      floorPlanObj?.isSync,
      floorPlanObj?.lastUpdate,
      floorPlanObj?.storeId,
      floorPlanObj?.tableName,
      floorPlanObj?.transform,
      floorPlanObj?.width,
      floorPlanObj?.seatingCapacityCount,
      floorPlanObj?.borderRadius,
      floorPlanObj?.height,
      floorPlanObj?.floorId,
      floorPlanObj?.tableId
    );
    console.log(
      `Update ${result.changes} rows with last ID ${result.lastInsertRowid} into table`
    );

    if (result.changes === 1) {
      console.log("Floor plan updated successfully!");
      return result;
    } else {
      console.error("Error adding table.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteFloorPlanTableById = (floorPlanId) => {
  console.log("floorPlanId... ", floorPlanId);
  try {
    const deteleQuery = "DELETE FROM floorPlan WHERE floorPlanId = ?";
    const readQuery = db.prepare(deteleQuery);
    const deletedFloorPlanTable = readQuery.run(floorPlanId);
    console.log("deletedFloorPlanTable... ", deletedFloorPlanTable);
    if (deletedFloorPlanTable.changes === 1) {
      console.log("floorPlan deleted successfully!");
      return deletedFloorPlanTable;
    } else {
      console.log("floorPlan not found");
    }
    return deletedFloorPlanTable;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllFloorPlan = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM floorPlan");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All floorPlans are deleted successfully!");
      return true;
    } else {
      console.log("floorPlan not founded.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getFloorPlanTableList,
  insertFloorPlanTable,
  updateFloorPlanTableById,
  deleteFloorPlanTableById,
  deleteAllFloorPlan
};
