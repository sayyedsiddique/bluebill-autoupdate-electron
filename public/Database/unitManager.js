const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getUnits = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS unit (
          unitId INTEGER PRIMARY KEY,
          unitName TEXT,
          isMeasurable INTEGER DEFAULT (0),
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0),
          storeId INTEGER DEFAULT (-1)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = `SELECT * FROM unit`;
    console.log("query... ", db);
    const readQuery = db?.prepare(`SELECT * FROM unit`);
    const rowList = readQuery?.all();
    console.log("unitList... ", rowList);
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// add unit
const insertUnit = (
  unitId,
  unitName,
  isMeasurable,
  lastUpdate,
  isDeleted,
  isSync,
  storeId
) => {
  // console.log(
  //   `unitId: ${unitId}, unitName: ${unitName}, isMeasurable: ${isMeasurable}, lastUpdate: ${lastUpdate}, isDeleted: ${isDeleted}`
  // );
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS unit (
              unitId INTEGER PRIMARY KEY,
              unitName TEXT,
              isMeasurable INTEGER DEFAULT (0),
              lastUpdate INTEGER,
              isDeleted INTEGER DEFAULT (0),
              isSync INTEGER DEFAULT (0),
              storeId INTEGER DEFAULT (-1)
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO unit (unitId, unitName, isMeasurable, lastUpdate, isDeleted, isSync, storeId) VALUES (${unitId} , '${unitName}' , ${isMeasurable} , ${lastUpdate} , ${isDeleted}, ${isSync}, ${storeId})`
    );

    let info;
    const transaction = db.transaction(() => {
      info = insertQuery.run();
      console.log("info... ", info);
      console.log(
        `Inserted ${info.changes} rows with last ID ${info.lastInsertRowid} into unit`
      );
    });
    transaction();
    return info;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// get unit by id
const getUnitById = (unitId) => {
  console.log("unitId ", unitId);
  try {
    const selectQuery = db.prepare("SELECT * FROM unit WHERE unitId = ?");
    const unit = selectQuery.get(unitId);

    if (unit) {
      console.log("Found unit:", unit);
    } else {
      console.log("Unit not found");
    }
    return unit;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update unit by unit id
const updateUnitById = (unitObj) => {
  console.log("unitObj... ", unitObj);
  try {
    const updateQuery = db.prepare(
      "UPDATE unit SET unitName = ?, isMeasurable = ?, lastUpdate = ?, isDeleted = ?, isSync = ?, storeId = ? WHERE unitId = ?"
    );

    const result = updateQuery.run(
      unitObj?.unitName,
      unitObj?.isMeasurable,
      unitObj?.lastUpdate,
      unitObj?.isDeleted,
      unitObj?.isSync,
      unitObj?.storeId,
      unitObj?.unitId
    );

    if (result.changes === 1) {
      console.log("Unit updated successfully!");
    } else {
      console.error("Error updating unit. No records were changed.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete unit by id
const deleteUnitById = (unitId) => {
  try {
    const deleteQuery = db.prepare("DELETE FROM unit WHERE unitId = ?");
    const result = deleteQuery.run(unitId);
    if (result.changes === 1) {
      console.log("Unit deleted successfully!");
    } else {
      console.log("unit not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUnitNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare("SELECT * FROM unit WHERE isSync = ?");
    const unitNotSyncList = selectQuery.all(isSyncValue);

    if (unitNotSyncList) {
      console.log("Found not sync unit list:", unitNotSyncList);
    } else {
      console.log("Unit not found");
    }
    return unitNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// sync unit data from live api
const updateSyncUnit = (units, storeId) => {
  console.log("units... ", units);

  units &&
    units?.map((item) => {
      const unitObj = {
        unitName: item?.unitName,
        isMeasurable: item?.isMeasurable ? 1 : 0,
        lastUpdate: item?.lastUpdate,
        isDeleted: item?.isDeleted,
        isSync: 1,
        storeId: storeId,
        unitId: item?.unitId,
      };

      console.log("unitObj... ", unitObj);

      try {
        // const updateQuery = db.prepare(
        //   "UPDATE unit SET unitName = ?, isMeasurable = ?, lastUpdate = ?, isDeleted = ?, isSync = ?, storeId = ? WHERE unitId = ?"
        // );
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO unit (unitId, unitName, isMeasurable, lastUpdate, isDeleted, isSync, storeId) VALUES (${unitObj?.unitId} , '${unitObj?.unitName}' , ${unitObj?.isMeasurable} , ${unitObj?.lastUpdate} , ${unitObj?.isDeleted}, ${unitObj?.isSync}, ${unitObj?.storeId})`
        );

        let info;
        const transaction = db.transaction(() => {
          info = updateQuery.run();
          console.log("info... ", info);
          console.log(
            `INSERT OR REPLACE ${info.changes} rows with last ID ${info.lastInsertRowid} into unit`
          );

          if (info.changes === 1) {
            console.log("Category INSERT INTO successfully!");
          } else {
            console.error("Error adding category.");
          }
        });
        transaction();
        return info;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  toHardDeleteUnit();
};

// delete unit by id
const toHardDeleteUnit = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM unit WHERE isDeleted = 1");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("Unit hard deleted successfully!");
    } else {
      console.log("unit not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllUnits = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM unit");
    const result = deleteQuery.run();
    console.log("Number of units deleted:", result);
    if (result.changes === 1) {
      console.log("All units are deleted successfully!");
    } else {
      console.log("unit not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getUnits,
  insertUnit,
  updateUnitById,
  getUnitById,
  deleteUnitById,
  updateSyncUnit,
  toHardDeleteUnit,
  getUnitNotSyncList,
  deleteAllUnits,
};
