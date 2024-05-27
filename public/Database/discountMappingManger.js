const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all discount mapped list
const getDiscountMappedList = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS discountMapping (
          discountId INTEGER,
          productId INTEGER,
          storeId INTEGER,
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const readQuery = db?.prepare(`SELECT * FROM discountMapping`);
    const rowList = readQuery?.all();
    console.log("discountMapping... ", rowList);
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// insert mappedTax into sqlite database
const insertDiscountMapping = (discountObj) => {
  console.log("discountObj... ", discountObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS discountMapping (
          discountId INTEGER,
          productId INTEGER,
          storeId INTEGER,
          lastUpdate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO discountMapping (discountId, productId, storeId, lastUpdate, isDeleted, isSync) VALUES (${discountObj?.discountId}, ${discountObj?.productId}, ${discountObj?.storeId}, ${discountObj?.lastUpdate}, ${discountObj?.isDeleted}, ${discountObj?.isSync})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();

      if (result.changes === 1) {
        console.log("DiscountMapping inserted successfully!");
      } else {
        console.error("Error adding discountMapping.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert mappedTax into sqlite database
const updateDiscountMapping = (discountObj) => {
  console.log("discountObj... ", discountObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE discountMapping SET discountId = ? , storeId = ? , lastUpdate = ? , isDeleted = ? , isSync = ? WHERE productId = ?`
    );

    const result = updateQuery.run(
      discountObj?.discountId,
      discountObj?.storeId,
      discountObj?.lastUpdate,
      discountObj?.isDeleted,
      discountObj?.isSync,
      discountObj?.productId
    );

    if (result.changes === 1) {
      console.log("DiscountMapping updated successfully!");
    } else {
      console.error("Error updating discountMapping.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get discount mapping details from sqlite database
const getDiscountMappingDetails = (productId) => {
  console.log("productId... ", productId)
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM discountMapping WHERE productId = ?"
    );
    const discountMappingDetails = selectQuery.get(productId);

    if (discountMappingDetails) {
      console.log("Found discountMappingDetails:", discountMappingDetails);
    } else {
      console.log("discountMappingDetails not found");
    }
    return discountMappingDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete DiscountMapping by product id
const deleteDiscountMapping = (productId) => {
  console.log("productId... ", productId);
  try {
    const deleteQuery = db.prepare(
      "DELETE FROM discountMapping WHERE productId = ?"
    );
    const deleteDiscountMapped = deleteQuery.run(productId);

    if (deleteDiscountMapped) {
      console.log("deleteDiscountMapped deleted successfully!", deleteDiscountMapped);
    } else {
      console.log("deleteDiscountMapped not found");
    }
    return deleteDiscountMapped;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get discount mappig list which has isSync value 0
const getDiscountMappingNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM discountMapping WHERE isSync = ?"
    );
    const discountMappingNotSyncList = selectQuery.all(isSyncValue);

    if (discountMappingNotSyncList) {
      console.log(
        "Found discountMappingNotSyncList:",
        discountMappingNotSyncList
      );
    } else {
      console.log("discountMappingNotSyncList not found");
    }
    return discountMappingNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update data after sync completeion
const updateSyncDiscountMapping = (discountMappings) => {
  console.log("discountMappings... ", discountMappings);

  discountMappings &&
    discountMappings?.map((item) => {
      const discountObj = {
        discountId: item?.discountId,
        storeId: item?.storeId,
        lastUpdate: item?.lastUpdate,
        isDeleted: item?.isDeleted,
        isSync: 1,
        productId: item?.isDeleted,
      };
      console.log("discountObj... ", discountObj);

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO discountMapping (discountId, productId, storeId, lastUpdate, isDeleted, isSync) VALUES (${discountObj?.discountId}, ${discountObj?.productId}, ${discountObj?.storeId}, ${discountObj?.lastUpdate}, ${discountObj?.isDeleted}, ${discountObj?.isSync})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();

          if (result.changes === 1) {
            console.log("DiscountMapping INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding discountMapping.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery.run(
        //   discountObj?.discountId,
        //   discountObj?.storeId,
        //   discountObj?.lastUpdate,
        //   discountObj?.isDeleted,
        //   discountObj?.isSync,
        //   discountObj?.productId
        // );

        // if (result.changes === 1) {
        //   console.log("DiscountMapping sync updated successfully!");
        // } else {
        //   console.error("Error updating discountMapping.");
        // }
        // return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  toHardDiscountMapping();
};

// after syncing all data delete that item which has isDeleted value equal 1
const toHardDiscountMapping = () => {
  try {
    const deleteQuery = db.prepare(
      "DELETE FROM discountMapping WHERE isDeleted = 1"
    );
    const deleteDiscountMapped = deleteQuery.run();

    if (deleteDiscountMapped) {
      console.log("deleteDiscountMappe hard deleted successfully!");
    } else {
      console.log("deleteDiscountMapped not found");
    }
    return deleteDiscountMapped;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllDiscountMapping = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM discountMapping");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All discountMappings are deleted successfully!");
    } else {
      console.log("discountMapping not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getDiscountMappedList,
  insertDiscountMapping,
  updateDiscountMapping,
  getDiscountMappingDetails,
  deleteDiscountMapping,
  getDiscountMappingNotSyncList,
  updateSyncDiscountMapping,
  toHardDiscountMapping,
  deleteAllDiscountMapping,
};
