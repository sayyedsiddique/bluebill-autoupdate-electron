const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get table list data
const getTableList = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS restaurantTable (
          tableId INTEGER PRIMARY KEY,
          tableName TEXT,
          floorId INTEGER,
          seatingCapacityCount INTEGER,
          createdDate INTEGER,
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0),
          storeId INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM restaurantTable";
    const readQuery = db.prepare(query);
    const tableList = readQuery.all();
    console.log("tableListDB... ", tableList);
    return tableList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert table into sqlite database
const insertTable = (tableObj) => {
  console.log("tableObj... ", tableObj);
  try {
        // Define the SQL command to create the table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS restaurantTable (
          tableId INTEGER PRIMARY KEY,
          tableName TEXT,
          floorId INTEGER,
          seatingCapacityCount INTEGER,
          createdDate INTEGER,
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0),
          storeId INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);
    
    const insertQuery = db.prepare(
      `INSERT INTO restaurantTable (tableId, tableName, floorId, seatingCapacityCount, createdDate, lastUpdate, isDeleted, isSync, storeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run(
        tableObj?.tableId,
        tableObj?.tableName,
        tableObj?.floorId,
        tableObj?.seatingCapacityCount,
        tableObj?.createdDate,
        tableObj?.lastUpdate,
        tableObj?.isDeleted,
        tableObj?.isSync,
        tableObj?.storeId
      );
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into table`
      );

      if (result.changes === 1) {
        console.log("Table inserted successfully!");
        return result;
      } else {
        console.error("Error adding table.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTableById = (tableObj) => {
  try {
    const updateQuery = db.prepare(
      `UPDATE restaurantTable SET tableName = ?, floorId = ?, seatingCapacityCount = ?, createdDate = ?, lastUpdate = ?, isDeleted = ?, isSync = ?, storeId = ? WHERE tableId = ?`
    );
    const result = updateQuery.run(
      tableObj?.tableName,
      tableObj?.floorId,
      tableObj?.seatingCapacityCount,
      tableObj?.createdDate,
      tableObj?.lastUpdate,
      tableObj?.isDeleted,
      tableObj?.isSync,
      tableObj?.storeId,
      tableObj?.tableId
    );
    if (result.changes === 1) {
      console.log("Table updated successfully!");
    } else {
      console.error("Error updating table. No records were changed.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTableDetailsById = (tableId) => {
  try {
    const selectQuery = db.prepare(
      `SELECT * FROM restaurantTable WHERE tableId = ?`
    );
    const selectedTableDetails = selectQuery.get(tableId);

    if (selectedTableDetails) {
      console.log("Found TableDetails:", TableDetails);
    } else {
      console.log("TableDetails not found");
    }
    return selectedTableDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteTableById = (tableId) => {
  console.log("tableId... ", tableId);
  try {
    const deleteQuery = db.prepare(
      `DELETE FROM restaurantTable WHERE tableId = ?`
    );
    const deleteTableDetails = deleteQuery.run(tableId);

    if (deleteTableDetails) {
      console.log("Table deleted successfully!");
    } else {
      console.log("Table not found");
    }
    return deleteTableDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFloorMappedTableList = (floorId) => {
  console.log("getFloorMappedTableList... ", floorId);
  try {
    const selectQuery = db.prepare(
      `SELECT * FROM restaurantTable WHERE floorId = ?`
    );
    const mappedTableList = selectQuery.all(floorId);

    if (mappedTableList) {
      console.log("Found mappedTableList:", mappedTableList);
    } else {
      console.log("mappedTableList not found");
    }
    return mappedTableList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllTable = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM restaurantTable");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All restaurantTabls are deleted successfully!");
    } else {
      console.log("restaurantTable not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getTableList,
  insertTable,
  updateTableById,
  getTableDetailsById,
  deleteTableById,
  getFloorMappedTableList,
  deleteAllTable,
};
