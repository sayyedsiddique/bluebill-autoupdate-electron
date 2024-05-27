const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get floor list data
const getFloorList = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS floor (
          floorId INTEGER PRIMARY KEY,
          floorName TEXT,
          location TEXT,
          tableCount INTEGER DEFAULT (0),
          createdDate INTEGER,
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0),
          storeId INTEGER
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM floor";
    const readQuery = db.prepare(query);
    const floorList = readQuery.all();
    console.log("floorListDB... ", floorList);
    return floorList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertFloor = (floorObj) => {
  console.log("floorObj... ", floorObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS floor (
          floorId INTEGER PRIMARY KEY,
          floorName TEXT,
          location TEXT,
          tableCount INTEGER DEFAULT (0),
          createdDate INTEGER,
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0),
          storeId INTEGER
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO floor (floorId, floorName, location, tableCount, createdDate, lastUpdate, isDeleted, isSync, storeId) VALUES (${floorObj?.floorId}, '${floorObj?.floorName}', '${floorObj?.location}', ${floorObj?.tableCount}, ${floorObj?.createdDate}, ${floorObj?.lastUpdate}, ${floorObj?.isDeleted}, ${floorObj?.isSync}, ${floorObj?.storeId})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into floor`
      );

      if (result.changes === 1) {
        console.log("floor inserted successfully!");
        return result;
      } else {
        console.error("Error adding floor.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateFloor = (floorObj) => {
  console.log("updateFloorFloorObj...", floorObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE floor SET floorName = ?, location = ?, tableCount = ?, createdDate = ?, lastUpdate = ?, isDeleted = ?, isSync = ?, storeId = ? WHERE floorId = ?`
    );
    const result = updateQuery.run(
      floorObj?.floorName,
      floorObj?.location,
      floorObj?.tableCount,
      floorObj?.createdDate,
      floorObj?.lastUpdate,
      floorObj?.isDeleted,
      floorObj?.isSync,
      floorObj?.storeId,
      floorObj?.floorId
    );
    if (result.changes === 1) {
      console.log("Floor updated successfully!");
      return result;
    } else {
      console.error("Error updating floor. No records were changed.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSingleFloorDetialsById = (floorId) => {
  try {
    const selectQuery = db.prepare(`SELECT * FROM floor WHERE floorId = ?`);
    const selectedFloorDetails = selectQuery.get(floorId);

    if (selectedFloorDetails) {
      console.log("Found FloorDetails:", selectedFloorDetails);
    } else {
      console.log("FloorDetails not found");
    }
    return selectedFloorDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteFloorById = (floorId) => {
  try {
    const deleteQuery = db.prepare(`DELETE FROM floor WHERE floorId = ?`);
    const deleteFloorDetails = deleteQuery.run(floorId);

    if (deleteFloorDetails) {
      console.log("Floor deleted successfully!");
      return deleteFloorDetails;
    } else {
      console.log("Floor not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllFloor = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM floor");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All floors are deleted successfully!");
    } else {
      console.log("floor not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getFloorList,
  insertFloor,
  updateFloor,
  getSingleFloorDetialsById,
  deleteFloorById,
  deleteAllFloor,
};
