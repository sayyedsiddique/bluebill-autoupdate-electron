const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all discount
const getAllDiscounts = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS discount (
          discountId INTEGER PRIMARY KEY,
          discountName TEXT,
          discountVal INTEGER,
          endDate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isPercent INTEGER DEFAULT (0),
          lastUpdate INTEGER,
          startDate INTEGER,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM discount";
    const readyQuery = db?.prepare(query);
    const discountList = readyQuery?.all();
    console.log("SQLiteDiscountList ", discountList);
    return discountList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert discount into sqlite database
const insertDiscount = (discountObj) => {
  console.log("discountObj... ", discountObj)
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS discount (
          discountId INTEGER PRIMARY KEY,
          discountName TEXT,
          discountVal INTEGER,
          endDate INTEGER,
          isDeleted INTEGER DEFAULT (0),
          isPercent INTEGER DEFAULT (0),
          lastUpdate INTEGER,
          startDate INTEGER,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);
    
    const insertQuery = db.prepare(
      `INSERT INTO discount (discountId , discountName , discountVal , endDate , isDeleted , isPercent , lastUpdate , startDate , storeId , isSync) VALUES (${
        discountObj?.discountId
      } , '${discountObj?.discountName}' , ${parseInt(
        discountObj?.discountVal
      )} , ${discountObj?.endDate} , ${discountObj?.isDeleted} , ${
        discountObj?.isPercent
      } , ${discountObj?.lastUpdate} , ${discountObj?.startDate} , ${
        discountObj?.storeId
      } , ${discountObj?.isSync})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into tax`
      );

      if (result.changes === 1) {
        console.log("discount inserted successfully!");
      } else {
        console.error("Error adding discount.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update discount in sqlite datebase by discount id
const updateDiscountById = (discountObj) => {
  console.log("updateDiscountById... ", discountObj);
  try {
    const updateQuery = db?.prepare(
      "UPDATE discount SET discountName = ? , discountVal = ? , endDate = ? , isDeleted = ? , isPercent = ? , lastUpdate = ? , startDate = ? , storeId = ? , isSync = ?  WHERE discountId = ? "
    );
    const result = updateQuery?.run(
      discountObj?.discountName,
      discountObj?.discountVal,
      discountObj?.endDate,
      discountObj?.isDeleted,
      discountObj?.isPercent,
      discountObj?.lastUpdate,
      discountObj?.startDate,
      discountObj?.storeId,
      discountObj?.isSync,
      discountObj?.discountId
    );

    if (result.changes === 1) {
      console.log("Discount updated successfully!");
    } else {
      console.error("Error updating discount. No records were changed.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get discount details by id
const getDiscountDetailsById = (discountId) => {
  try {
    const query = db.prepare("SELECT * FROM discount WHERE discountId = ?");
    const selectedDiscount = query?.get(discountId);
    if (selectedDiscount) {
      console.log("Found selectedDiscount:", selectedDiscount);
    } else {
      console.log("selectedDiscount not found");
    }
    return selectedDiscount;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete discount by id from sqlite database
const deleteDiscountById = (discountId) => {
  try {
    const query = "DELETE FROM discount WHERE discountId = ?";
    const readQuery = db.prepare(query);
    const deletedQuery = readQuery?.run(discountId);
    if (deletedQuery) {
      console.log("Discount deleted successfully!");
    } else {
      console.log("Discount not found");
    }
    return deletedQuery;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getDiscountNotSyncList = (isSyncValue) => {
  try {
    const query = db.prepare("SELECT * FROM discount WHERE isSync = ?");
    const discountNotSyncList = query?.all(isSyncValue);
    if (discountNotSyncList) {
      console.log("Found discountNotSyncList:", discountNotSyncList);
    } else {
      console.log("discountNotSyncList not found");
    }
    return discountNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncDiscount = (discounts, storeId) => {
  console.log("discounts... ", discounts);

  discounts &&
    discounts?.map((item) => {
      const discountObj = {
        discountName: item?.discountName,
        discountVal: item?.discountVal,
        endDate: item?.endDate,
        isDeleted: item?.isDeleted,
        isPercent: item?.isPercent ? 1 : 0,
        lastUpdate: item?.lastUpdate,
        startDate: item?.startDate,
        storeId: storeId,
        isSync: 1,
        discountId: item?.discountId,
      };
      console.log("discountObj... ", discountObj);

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO discount (discountId , discountName , discountVal , endDate , isDeleted , isPercent , lastUpdate , startDate , storeId , isSync) VALUES (${
            discountObj?.discountId
          } , '${discountObj?.discountName}' , ${parseInt(
            discountObj?.discountVal
          )} , ${discountObj?.endDate} , ${discountObj?.isDeleted} , ${
            discountObj?.isPercent
          } , ${discountObj?.lastUpdate} , ${discountObj?.startDate} , ${
            discountObj?.storeId
          } , ${discountObj?.isSync})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into tax`
          );

          if (result.changes === 1) {
            console.log("discount INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding discount.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery?.run(
        //   discountObj?.discountName,
        //   discountObj?.discountVal,
        //   discountObj?.endDate,
        //   discountObj?.isDeleted,
        //   discountObj?.isPercent,
        //   discountObj?.lastUpdate,
        //   discountObj?.startDate,
        //   discountObj?.storeId,
        //   discountObj?.isSync,
        //   discountObj?.discountId
        // );

        // if (result.changes === 1) {
        //   console.log("Discount sync updated successfully!");
        // } else {
        //   console.error("Error updating discount. No records were changed.");
        // }
        // return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  toHardDeleteDiscount();
};

const toHardDeleteDiscount = () => {
  try {
    const query = "DELETE FROM discount WHERE isDeleted = 1";
    const readQuery = db.prepare(query);
    const deletedQuery = readQuery?.run();
    if (deletedQuery) {
      console.log("Discount hard deleted successfully!");
    } else {
      console.log("Discount not found");
    }
    return deletedQuery;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllDiscount = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM discount");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All discounts are deleted successfully!");
    } else {
      console.log("discount not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllDiscounts,
  insertDiscount,
  updateDiscountById,
  getDiscountDetailsById,
  deleteDiscountById,
  getDiscountNotSyncList,
  updateSyncDiscount,
  toHardDeleteDiscount,
  deleteAllDiscount,
};
