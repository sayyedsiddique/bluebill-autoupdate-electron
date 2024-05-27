const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all taxes
const getAllTaxes = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tax (
          taxId INTEGER PRIMARY KEY,
          taxName TEXT,
          taxValue INTEGER,
          lastUpdate INTEGER,
          isSync INTEGER DEFAULT (0),
          storeId INTEGER DEFAULT (-1), 
          isDeleted INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM tax";
    const readQuery = db.prepare(query);
    const taxList = readQuery?.all();
    console.log("taxList... ", taxList);
    return taxList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert data into sqlite database
const insertTax = (taxObj) => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tax (
          taxId INTEGER PRIMARY KEY,
          taxName TEXT,
          taxValue INTEGER,
          lastUpdate INTEGER,
          isSync INTEGER DEFAULT (0),
          storeId INTEGER DEFAULT (-1), 
          isDeleted INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO tax (taxId, taxName, taxValue, lastUpdate, isSync, storeId) VALUES (${taxObj?.taxId} , '${taxObj?.taxName}' , ${taxObj?.taxValue} , ${taxObj?.lastUpdate} , ${taxObj?.isSync} , ${taxObj?.storeId})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into tax`
      );

      if (result.changes === 1) {
        console.log("tax inserted successfully!");
      } else {
        console.error("Error adding tax.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get tax details by id
const getTaxDetailsById = (taxId) => {
  try {
    const query = "SELECT * FROM tax WHERE taxId = ?";
    const readQuery = db.prepare(query);
    const selectedTax = readQuery?.get(taxId);

    if (selectedTax) {
      console.log("Found selectedTax:", selectedTax);
    } else {
      console.log("selectedTax not found");
    }
    return selectedTax;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTaxById = (taxObj) => {
  try {
    const updateQuery = db.prepare(
      "UPDATE tax SET taxName = ? , taxValue = ? , lastUpdate = ? , isSync = ? , storeId = ? , isDeleted = ? WHERE taxId = ?"
    );
    const result = updateQuery?.run(
      taxObj?.taxName,
      taxObj?.taxValue,
      taxObj?.lastUpdate,
      taxObj?.isSync,
      taxObj?.storeId,
      taxObj?.isDeleted,
      taxObj?.taxId
    );

    if (result.changes === 1) {
      console.log("Tax updated successfully!");
    } else {
      console.error("Error updating tax. No records were changed.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteTaxById = (taxId) => {
  try {
    const query = "DELETE FROM tax WHERE taxId = ?";
    const readQuery = db?.prepare(query);
    const deletedTax = readQuery?.run(taxId);

    if (deletedTax) {
      console.log("Tax deleted successfully!");
    } else {
      console.log("Tax not found");
    }
    return deletedTax;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTaxNotSyncList = (isSyncValue) => {
  try {
    const query = "SELECT * FROM tax WHERE isSync = ?";
    const readQuery = db.prepare(query);
    const taxNotSyncList = readQuery?.all(isSyncValue);

    if (taxNotSyncList) {
      console.log("Found taxNotSyncList:", taxNotSyncList);
    } else {
      console.log("taxNotSyncList not found");
    }
    return taxNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncTax = (taxes, storeId) => {
  console.log("taxes... ", taxes);
  taxes &&
    taxes?.map((item) => {
      const taxObj = {
        taxName: item?.taxName,
        taxValue: item?.taxValue,
        lastUpdate: item?.lastUpdate,
        isSync: 1,
        storeId: storeId,
        isDeleted: item?.isDeleted,
        taxId: item?.taxId,
      };
      console.log("taxObj... ", taxObj);

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO tax (taxId, taxName, taxValue, lastUpdate, isSync, storeId) VALUES (${taxObj?.taxId} , '${taxObj?.taxName}' , ${taxObj?.taxValue} , ${taxObj?.lastUpdate} , ${taxObj?.isSync} , ${taxObj?.storeId})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into tax`
          );

          if (result.changes === 1) {
            console.log("tax INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding tax.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery?.run(
        //   taxObj?.taxName,
        //   taxObj?.taxValue,
        //   taxObj?.lastUpdate,
        //   taxObj?.isSync,
        //   taxObj?.storeId,
        //   taxObj?.isDeleted,
        //   taxObj?.taxId
        // );

        // if (result.changes === 1) {
        //   console.log("Tax sync updated successfully!");
        // } else {
        //   console.error("Error updating tax. No records were changed.");
        // }
        // return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  toHardDeleteTax();
};

const toHardDeleteTax = () => {
  try {
    const query = "DELETE FROM tax WHERE isDeleted = 1";
    const readQuery = db?.prepare(query);
    const hardDeletedTax = readQuery?.run();

    if (hardDeletedTax) {
      console.log("Tax hard deleted successfully!");
    } else {
      console.log("Tax not found");
    }
    return hardDeletedTax;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllTax = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM tax");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All taxs are deleted successfully!");
    } else {
      console.log("tax not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllTaxes,
  insertTax,
  getTaxDetailsById,
  updateTaxById,
  deleteTaxById,
  getTaxNotSyncList,
  updateSyncTax,
  toHardDeleteTax,
  deleteAllTax,
};
