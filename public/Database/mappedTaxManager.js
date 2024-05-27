const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all mapped tax list
const getMappedTaxList = () => {
  try {
        // Define the SQL command to create the table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS mappedTax (
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

    const readQuery = db?.prepare(`SELECT * FROM mappedTax`);
    const rowList = readQuery?.all();
    console.log("mappedTax... ", rowList);
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// insert mappedTax into sqlite database
const insertMappedTax = (mappedTaxObj) => {
  console.log("mappedTaxObj... ", mappedTaxObj);
  try {
            // Define the SQL command to create the table if it doesn't exist
            const createTableQuery = `
            CREATE TABLE IF NOT EXISTS mappedTax (
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
      `INSERT INTO mappedTax (taxId, productId, storeId, lastUpdate, isSync, isDeleted) VALUES (${mappedTaxObj?.taxId}, ${mappedTaxObj?.productId}, ${mappedTaxObj?.storeId}, ${mappedTaxObj?.lastUpdate}, ${mappedTaxObj?.isSync}, ${mappedTaxObj?.isDeleted})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();

      if (result.changes === 1) {
        console.log("MappedTax inserted successfully!");
      } else {
        console.error("Error adding mappedTax.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update mappedTax in sqlite database
const updateMappedTax = (mappedTaxObj) => {
  console.log("mappedTaxObjupdate... ", mappedTaxObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE mappedTax SET productId = ? , storeId = ? , lastUpdate = ? , isSync = ? , isDeleted = ? WHERE taxId = ? `
    );

    const result = updateQuery.run(
      mappedTaxObj?.productId,
      mappedTaxObj?.storeId,
      mappedTaxObj?.lastUpdate,
      mappedTaxObj?.isSync,
      mappedTaxObj?.isDeleted,
      mappedTaxObj?.taxId
    );

    if (result.changes === 1) {
      console.log("MappedTax updated successfully!");
    } else {
      console.error("Error updated mappedTax.");
    }

    return result;
  } catch (error) {
    console.error(err);
    throw err;
  }
};

// get mappedTax details from sqlite database
const getMappedTaxDetails = (productId) => {
  try {
    const selectQuery = db.prepare("SELECT * FROM mappedTax WHERE productId = ?");
    const mappedTaxDetails = selectQuery.get(productId);

    if (mappedTaxDetails) {
      console.log("Found mappedTaxDetails:", mappedTaxDetails);
    } else {
      console.log("mappedTaxDetails not found");
    }
    return mappedTaxDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete mappedTax by id
const deleteMappedTax = (productId) => {
  console.log("productId... ", productId);
  try {
    const deleteQuery = db.prepare("DELETE FROM mappedTax WHERE productId = ?");
    const deletedMappedTax = deleteQuery.run(productId);
    console.log("deletedMappedTax... ", deletedMappedTax)

    if (deletedMappedTax?.changes === 1) {
      console.log("MappedTax deleted successfully!");
    } else {
      console.log("MappedTax not found");
    }
    return deletedMappedTax;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTaxMappedNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare("SELECT * FROM mappedTax WHERE isSync = ?");
    const mappedTaxNotSyncList = selectQuery.all(isSyncValue);

    if (mappedTaxNotSyncList) {
      console.log("Found mappedTaxNotSyncList:", mappedTaxNotSyncList);
    } else {
      console.log("mappedTaxNotSyncList not found");
    }
    return mappedTaxNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncMappedTax = (taxMappings) => {
  console.log("taxMappings... ", taxMappings);
  taxMappings &&
    taxMappings?.map((item) => {
      const mappedTaxObj = {
        productId: item?.productId,
        storeId: item?.storeId,
        lastUpdate: item?.lastUpdate,
        isSync: 1,
        isDeleted: item?.isDeleted,
        taxId: item?.taxId,
      };
      console.log("mappedTaxObj... ", mappedTaxObj)

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO mappedTax (taxId, productId, storeId, lastUpdate, isSync, isDeleted) VALUES (${mappedTaxObj?.taxId}, ${mappedTaxObj?.productId}, ${mappedTaxObj?.storeId}, ${mappedTaxObj?.lastUpdate}, ${mappedTaxObj?.isSync}, ${mappedTaxObj?.isDeleted})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();

          if (result.changes === 1) {
            console.log("MappedTax INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding mappedTax.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery.run(
        //   mappedTaxObj?.productId,
        //   mappedTaxObj?.storeId,
        //   mappedTaxObj?.lastUpdate,
        //   mappedTaxObj?.isSync,
        //   mappedTaxObj?.isDeleted,
        //   mappedTaxObj?.taxId
        // );

        // if (result.changes === 1) {
        //   console.log("MappedTax sync updated successfully!");
        // } else {
        //   console.error("Error updated mappedTax.");
        // }

        // return result;
      } catch (error) {
        console.error(err);
        throw err;
      }
    });

  toHardDeleteMappedTax();
};

const toHardDeleteMappedTax = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM mappedTax WHERE isDeleted = 1");
    const deletedMappedTax = deleteQuery.run();

    if (deletedMappedTax) {
      console.log("MappedTax hard deleted successfully!");
    } else {
      console.log("MappedTax not found");
    }
    return deletedMappedTax;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllMappedTax = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM mappedTax");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All mappedTaxs are deleted successfully!");
    } else {
      console.log("mappedTax not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getMappedTaxList,
  insertMappedTax,
  updateMappedTax,
  getMappedTaxDetails,
  deleteMappedTax,
  getTaxMappedNotSyncList,
  updateSyncMappedTax,
  toHardDeleteMappedTax,
  deleteAllMappedTax
};
