const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getStoreDetails = (storeId) => {
  console.log("storeId... ", storeId);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS storeDetails (
          storeId INTEGER PRIMARY KEY,
          storeName TEXT,
          storeCategory TEXT,
          mobileNumber TEXT,
          email TEXT,
          city TEXT,
          pinCode TEXT,
          address TEXT,
          latitude TEXT,
          longitude TEXT,
          gstNumber TEXT,
          currencyName TEXT,
          customerId INTEGER,
          deliveryCharges INTEGER,
          homeDelivery INTEGER DEFAULT (0),
          imageUrl TEXT,
          miniOrderLimit INTEGER DEFAULT (0),
          shopCloseDay TEXT,
          shopCloseTime TEXT,
          shopOpenTime TEXT,
          withInDistance TEXT,
          lastUpdate INTEGER
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM storeDetails WHERE storeId = ?";
    const readQuery = db.prepare(query);
    const selectedStore = readQuery.get(storeId);
    console.log("selectedStore... ", selectedStore);
    return selectedStore;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertStoreDetails = (storeDetails) => {
  console.log("storeDetails... ", storeDetails);
  try {
        // Define the SQL command to create the table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS storeDetails (
          storeId INTEGER PRIMARY KEY,
          storeName TEXT,
          storeCategory TEXT,
          mobileNumber TEXT,
          email TEXT,
          city TEXT,
          pinCode TEXT,
          address TEXT,
          latitude TEXT,
          longitude TEXT,
          gstNumber TEXT,
          currencyName TEXT,
          customerId INTEGER,
          deliveryCharges INTEGER,
          homeDelivery INTEGER DEFAULT (0),
          imageUrl TEXT,
          miniOrderLimit INTEGER DEFAULT (0),
          shopCloseDay TEXT,
          shopCloseTime TEXT,
          shopOpenTime TEXT,
          withInDistance TEXT,
          lastUpdate INTEGER
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      "INSERT INTO storeDetails (storeId, storeName, storeCategory, mobileNumber, email, city, pinCode, address, latitude, longitude, gstNumber, currencyName, customerId, deliveryCharges, homeDelivery, imageUrl, miniOrderLimit, shopCloseDay, shopCloseTime, shopOpenTime, withInDistance, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    let result;

    const transaction = db.transaction(() => {
      result = insertQuery.run(
        storeDetails?.storeId,
        storeDetails?.storeName,
        storeDetails?.storeCategory,
        storeDetails?.mobileNumber,
        storeDetails?.email,
        storeDetails?.city,
        storeDetails?.pinCode,
        storeDetails?.address,
        storeDetails?.latitude,
        storeDetails?.longitude,
        storeDetails?.gstNumber,
        storeDetails?.currencyName,
        storeDetails?.customerId,
        storeDetails?.deliveryCharges,
        storeDetails?.homeDelivery,
        storeDetails?.imageUrl,
        storeDetails?.miniOrderLimit,
        storeDetails?.shopCloseDay,
        storeDetails?.shopCloseTime,
        storeDetails?.shopOpenTime,
        storeDetails?.withInDistance,
        storeDetails?.lastUpdate
      );

      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into storeDetails`
      );

      if (result.changes === 1) {
        console.log("StoreDetails inserted successfully!");
        return result;
      } else {
        console.error("Error adding storeDetails.");
      }
    });
    transaction();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllStoreDetails = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM storeDetails");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All storeDetails are deleted successfully!");
    } else {
      console.log("storeDetails not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getStoreDetails,
  insertStoreDetails,
  deleteAllStoreDetails,
};
