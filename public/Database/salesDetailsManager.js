const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all transactionpayment
const getSalesDetailsList = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
       CREATE TABLE IF NOT EXISTS salesDetails (
        salesDetailsId INTEGER PRIMARY KEY,
        paymentId INTEGER,
        productId INTEGER,
        productName TEXT,
        purchasingPrice INTEGER,
        modeOfPayment TEXT,
        currencyName TEXT,
        currencyId INTEGER DEFAULT (0),
        discountVal INTEGER DEFAULT (0),
        salesPrice INTEGER,
        salesQuantity INTEGER,
        salestotalAmount INTEGER,
        taxValue INTEGER DEFAULT (0),
        isDeleted INTEGER DEFAULT (0),
        isSync INTEGER DEFAULT (0),
        storeId INTEGER,
        clientLastUpdated INTEGER,
        unitId INTEGER DEFAULT (0), 
        unitName TEXT, 
        lastUpdate INTEGER DEFAULT (0)
       )
       `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM salesDetails";
    const readQuery = db.prepare(query);
    const salesDetailsList = readQuery?.all();
    console.log("salesDetailsList ", salesDetailsList);
    return salesDetailsList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add salesDetails in sqlite database
const inserSalesDetails = (salesDetailsObj) => {
  console.log("inserSalesDetails ", salesDetailsObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS salesDetails (
         salesDetailsId INTEGER PRIMARY KEY,
         paymentId INTEGER,
         productId INTEGER,
         productName TEXT,
         purchasingPrice INTEGER,
         modeOfPayment TEXT,
         currencyName TEXT,
         currencyId INTEGER DEFAULT (0),
         discountVal INTEGER DEFAULT (0),
         salesPrice INTEGER,
         salesQuantity INTEGER,
         salestotalAmount INTEGER,
         taxValue INTEGER DEFAULT (0),
         isDeleted INTEGER DEFAULT (0),
         isSync INTEGER DEFAULT (0),
         storeId INTEGER,
         clientLastUpdated INTEGER, 
         unitId INTEGER DEFAULT (0), 
         unitName TEXT, 
         lastUpdate INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(`INSERT INTO salesDetails (salesDetailsId,
        paymentId,
        productId,
        productName,
        purchasingPrice,
        modeOfPayment,
        currencyName,
        currencyId,
        discountVal,
        salesPrice,
        salesQuantity,
        salestotalAmount,
        taxValue,
        isDeleted,
        isSync,
        storeId,
        clientLastUpdated,
        unitId,
        unitName, 
        lastUpdate) VALUES (${salesDetailsObj?.salesDetailsId} , ${salesDetailsObj?.paymentId} , ${salesDetailsObj?.productId} , '${salesDetailsObj?.productName}' , ${salesDetailsObj?.purchasingPrice} , '${salesDetailsObj?.modeOfPayment}' , '${salesDetailsObj?.currencyName}' , ${salesDetailsObj?.currencyId} , ${salesDetailsObj?.discountVal} , ${salesDetailsObj?.salesPrice} , ${salesDetailsObj?.salesQuantity} , ${salesDetailsObj?.salestotalAmount} , ${salesDetailsObj?.taxValue} , ${salesDetailsObj?.isDeleted} , ${salesDetailsObj?.isSync} , ${salesDetailsObj?.storeId} , ${salesDetailsObj?.clientLastUpdated}, ${salesDetailsObj?.unitId}, '${salesDetailsObj?.unitName}', ${salesDetailsObj?.lastUpdate})`);

    let result;
    const transaction = db.transaction(() => {
      result = insertQuery?.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into salesDetails`
      );

      if (result.changes === 1) {
        console.log("salesDetails inserted successfully!");
      } else {
        console.error("Error adding salesDetails.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSalesDetails = (salesDetailsObj) => {
  try {
    const updateQuery = db.prepare(`UPDATE salesDetails SET ,
          paymentId = ? ,
          productId = ? ,
          productName = ? ,
          purchasingPrice = ? ,
          modeOfPayment = ? ,
          currencyName = ? ,
          currencyId = ? ,
          discountVal = ? ,
          salesPrice = ? ,
          salesQuantity = ? ,
          salesQuantity = ? ,
          salestotalAmount = ? ,
          taxValue = ? ,
          isDeleted = ? ,
          isSync = ? ,
          storeId = ? ,
          clientLastUpdated,
          unitId,
          unitName, 
          lastUpdate WHERE salesDetailsId = ? `);
    let result;
    const transaction = db.transaction(() => {
      result = updateQuery?.run(
        salesDetailsObj?.paymentId,
        salesDetailsObj?.productId,
        salesDetailsObj?.productName,
        salesDetailsObj?.purchasingPrice,
        salesDetailsObj?.modeOfPayment,
        salesDetailsObj?.currencyName,
        salesDetailsObj?.currencyId,
        salesDetailsObj?.discountVal,
        salesDetailsObj?.salesPrice,
        salesDetailsObj?.salesQuantity,
        salesDetailsObj?.salesQuantity,
        salesDetailsObj?.salestotalAmount,
        salesDetailsObj?.taxValue,
        salesDetailsObj?.isDeleted,
        salesDetailsObj?.isSync,
        salesDetailsObj?.storeId,
        salesDetailsObj?.clientLastUpdated,
        salesDetailsObj?.unitId,
        salesDetailsObj?.unitName,
        salesDetailsObj?.lastUpdate,
        salesDetailsObj?.salesDetailsId
      );
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into salesDetails`
      );

      if (result.changes === 1) {
        console.log("salesDetails updated successfully!");
      } else {
        console.error("Error adding salesDetails.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSingleSalesDetails = (salesDetailsId) => {
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM salesDetails WHERE salesDetailsId = ?"
    );
    const salesDetails = selectQuery.get(salesDetailsId);

    if (salesDetails) {
      console.log("Found salesDetails:", salesDetails);
    } else {
      console.log("salesDetails not found");
    }
    return salesDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSalesDetailsNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM salesDetails WHERE isSync = ?"
    );
    const salesDetailsNotSyncList = selectQuery.all(isSyncValue);

    if (salesDetailsNotSyncList) {
      console.log("Found salesDetailsNotSyncList:", salesDetailsNotSyncList);
    } else {
      console.log("salesDetailsNotSyncList not found");
    }
    return salesDetailsNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncSalesDetails = (saleDetails) => {
  console.log("saleDetails... ", saleDetails);

  saleDetails &&
    saleDetails?.map((item) => {
      const salesDetailsObj = {
        paymentId: item?.paymentId,
        productId: item?.productId,
        productName: item?.productName,
        purchasingPrice: item?.purchasingPrice,
        modeOfPayment: item?.modeOfPayment,
        currencyName: item?.currencyName,
        currencyId: item?.currencyId,
        discountVal: item?.discountVal,
        salesPrice: item?.salesPrice,
        salesQuantity: item?.salesQuantity,
        salestotalAmount: item?.salestotalAmount,
        taxValue: item?.taxValue,
        isDeleted: item?.isDeleted,
        isSync: item?.isSync,
        storeId: item?.storeId,
        clientLastUpdated: item?.clientLastUpdated,
        unitId: item?.unitId,
        unitName: item?.unitName,
        lastUpdate: item?.lastUpdate,
        salesDetailsId: item?.clientLastUpdated,
        
      };

      console.log("salesDetailsObj... ", salesDetailsObj);

      try {
        // const updateQuery = db.prepare(`UPDATE salesDetails SET ,
        //     paymentId = ? ,
        //     productId = ? ,
        //     productName = ? ,
        //     purchasingPrice = ? ,
        //     modeOfPayment = ? ,
        //     currencyName = ? ,
        //     currencyId = ? ,
        //     discountVal = ? ,
        //     salesPrice = ? ,
        //     salesQuantity = ? ,
        //     salestotalAmount = ? ,
        //     taxValue = ? ,
        //     isDeleted = ? ,
        //     isSync = ? ,
        //     storeId = ? ,
        //     clientLastUpdated WHERE salesDetailsId = ? `);

        const insertOrUpdateQuery =
          db.prepare(`INSERT OR REPLACE INTO salesDetails (salesDetailsId,
          paymentId,
          productId,
          productName,
          purchasingPrice,
          modeOfPayment,
          currencyName,
          currencyId,
          discountVal,
          salesPrice,
          salesQuantity,
          salestotalAmount,
          taxValue,
          isDeleted,
          isSync,
          storeId,
          clientLastUpdated,
          unitId,
          unitName, 
          lastUpdate ) VALUES (${salesDetailsObj?.salesDetailsId} , ${salesDetailsObj?.paymentId} , ${salesDetailsObj?.productId} , '${salesDetailsObj?.productName}' , ${salesDetailsObj?.purchasingPrice} , '${salesDetailsObj?.modeOfPayment}' , '${salesDetailsObj?.currencyName}' , ${salesDetailsObj?.currencyId} , ${salesDetailsObj?.discountVal} , ${salesDetailsObj?.salesPrice} , ${salesDetailsObj?.salesQuantity} , ${salesDetailsObj?.salestotalAmount} , ${salesDetailsObj?.taxValue} , ${salesDetailsObj?.isDeleted} , ${salesDetailsObj?.isSync} , ${salesDetailsObj?.storeId} , ${salesDetailsObj?.clientLastUpdated}, ${salesDetailsObj?.unitId}, '${salesDetailsObj?.unitName}', ${salesDetailsObj?.lastUpdate})`);

        let result;
        const transaction = db.transaction(() => {
          result = insertOrUpdateQuery?.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into salesDetails`
          );

          if (result.changes === 1) {
            console.log("salesDetails INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding salesDetails.");
          }
        });
        transaction();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  toHardDeleteSalesDetails();
};

const toHardDeleteSalesDetails = () => {
  try {
    const deleteQuery = db.prepare(
      "DELETE from salesDetails WHERE isDeleted = 1"
    );
    const deletedSalesDetails = deleteQuery.run();
    if (deletedSalesDetails) {
      console.log("SalesDetails hard deleted successfully!");
    } else {
      console.log("SalesDetails not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllSalesDetails = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS salesDetails (
             salesDetailsId INTEGER PRIMARY KEY,
             paymentId INTEGER,
             productId INTEGER,
             productName TEXT,
             purchasingPrice INTEGER,
             modeOfPayment TEXT,
             currencyName TEXT,
             currencyId INTEGER DEFAULT (0),
             discountVal INTEGER DEFAULT (0),
             salesPrice INTEGER,
             salesQuantity INTEGER,
             salestotalAmount INTEGER,
             taxValue INTEGER DEFAULT (0),
             isDeleted INTEGER DEFAULT (0),
             isSync INTEGER DEFAULT (0),
             storeId INTEGER,
             clientLastUpdated INTEGER,
             unitId INTEGER DEFAULT (0), 
             unitName TEXT, 
             lastUpdate INTEGER DEFAULT (0)
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const deleteQuery = db.prepare("DELETE FROM salesDetails");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All salesDetails are deleted successfully!");
    } else {
      console.log("salesDetails not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getSalesDetailsList,
  inserSalesDetails,
  updateSalesDetails,
  getSingleSalesDetails,
  getSalesDetailsNotSyncList,
  updateSyncSalesDetails,
  toHardDeleteSalesDetails,
  deleteAllSalesDetails,
};
