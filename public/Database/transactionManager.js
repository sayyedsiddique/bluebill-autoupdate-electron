const dbmgr = require("./dbManager");
const db = dbmgr.db;
const salesDetailsDB = require("./salesDetailsManager");

// get all transactionpayment
const getTransactionList = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS transactionpayment (
          paymentId INTEGER PRIMARY KEY,
          finaltotalAmount INTEGER,
          customerName TEXT,
          customerId INTEGER DEFAULT (0),
          salesExecutiveName TEXT,
          sales_executiveId INTEGER,
          totalAmount INTEGER,
          totalBalance INTEGER,
          totalPayment INTEGER DEFAULT (0),
          transaction_typeName TEXT,
          userName TEXT,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0),
          notes TEXT,
          mobileNumber TEXT,
          isDeleted INTEGER DEFAULT (0),
          discount INTEGER DEFAULT (0),
          currencyName TEXT,
          clientLastUpdated INTEGER,
          dateAdded TEXT,
          dateUpdated TEXT,
          updatedBy TEXT,
          modeOfPayment TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM transactionpayment";
    const readQuery = db.prepare(query);
    const transactionPaymentList = readQuery?.all();
    console.log("transactionPaymentList ", transactionPaymentList);
    return transactionPaymentList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get transaction payment list by month
const getTransactionPaymentByMonth = (payload) => {
  console.log("payload... ", payload);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS transactionpayment (
          paymentId INTEGER PRIMARY KEY,
          finaltotalAmount INTEGER,
          customerName TEXT,
          customerId INTEGER DEFAULT (0),
          salesExecutiveName TEXT,
          sales_executiveId INTEGER,
          totalAmount INTEGER,
          totalBalance INTEGER,
          totalPayment INTEGER DEFAULT (0),
          transaction_typeName TEXT,
          userName TEXT,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0),
          notes TEXT,
          mobileNumber TEXT,
          isDeleted INTEGER DEFAULT (0),
          discount INTEGER DEFAULT (0),
          currencyName TEXT,
          clientLastUpdated INTEGER,
          dateAdded TEXT,
          dateUpdated TEXT,
          updatedBy TEXT,
          modeOfPayment TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = `SELECT * FROM transactionpayment WHERE clientLastUpdated >= ? and clientLastUpdated <= ?`;
    const readQuery = db.prepare(query);
    const transactionPaymentList = readQuery?.all(
      payload?.endDate,
      payload?.startDate
    );
    console.log("transactionPaymentList ", transactionPaymentList);
    return transactionPaymentList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get transaction payment list by date
const getTransactionPaymentByDate = (payload) => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS transactionpayment (
          paymentId INTEGER PRIMARY KEY,
          finaltotalAmount INTEGER,
          customerName TEXT,
          customerId INTEGER DEFAULT (0),
          salesExecutiveName TEXT,
          sales_executiveId INTEGER,
          totalAmount INTEGER,
          totalBalance INTEGER,
          totalPayment INTEGER DEFAULT (0),
          transaction_typeName TEXT,
          userName TEXT,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0),
          notes TEXT,
          mobileNumber TEXT,
          isDeleted INTEGER DEFAULT (0),
          discount INTEGER DEFAULT (0),
          currencyName TEXT,
          clientLastUpdated INTEGER,
          dateAdded TEXT,
          dateUpdated TEXT,
          updatedBy TEXT,
          modeOfPayment TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM transactionpayment";
    const readQuery = db.prepare(query);
    const transactionPaymentList = readQuery?.all();
    console.log("transactionPaymentList ", transactionPaymentList);
    return transactionPaymentList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add transaction in sqlite database
const insertTransactionPayment = (transactionPaymentObj) => {
  console.log("transactionPaymentObj... ", transactionPaymentObj);
  console.log(
    "transactionPaymentObjSD... ",
    transactionPaymentObj?.salesDetail
  );
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
           CREATE TABLE IF NOT EXISTS transactionpayment (
             paymentId INTEGER PRIMARY KEY,
             finaltotalAmount INTEGER,
             customerName TEXT,
             customerId INTEGER DEFAULT (0),
             salesExecutiveName TEXT,
             sales_executiveId INTEGER,
             totalAmount INTEGER,
             totalBalance INTEGER,
             totalPayment INTEGER DEFAULT (0),
             transaction_typeName TEXT,
             userName TEXT,
             storeId INTEGER,
             isSync INTEGER DEFAULT (0),
             notes TEXT,
             mobileNumber TEXT,
             isDeleted INTEGER DEFAULT (0),
             discount INTEGER DEFAULT (0),
             currencyName TEXT,
             clientLastUpdated INTEGER,
             dateAdded TEXT,
             dateUpdated TEXT,
             updatedBy TEXT,
             modeOfPayment TEXT
           )
           `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO transactionpayment (paymentId, finaltotalAmount, customerName, customerId, salesExecutiveName, sales_executiveId, totalAmount, totalBalance, totalPayment, transaction_typeName, userName, storeId, isSync, notes, mobileNumber, isDeleted, discount, currencyName, clientLastUpdated, dateAdded, dateUpdated, updatedBy, modeOfPayment) VALUES (${transactionPaymentObj?.paymentId} , ${transactionPaymentObj?.finaltotalAmount} , '${transactionPaymentObj?.customerName}' , ${transactionPaymentObj?.customerId} , '${transactionPaymentObj?.salesExecutiveName}' , ${transactionPaymentObj?.sales_executiveId} , ${transactionPaymentObj?.totalAmount} , ${transactionPaymentObj?.totalBalance} , ${transactionPaymentObj?.totalPayment} , '${transactionPaymentObj?.transaction_typeName}' , '${transactionPaymentObj?.userName}' , ${transactionPaymentObj?.storeId} ,${transactionPaymentObj?.isSync} , '${transactionPaymentObj?.notes}' , '${transactionPaymentObj?.mobileNumber}' , ${transactionPaymentObj?.isDeleted} , ${transactionPaymentObj?.discount} , '${transactionPaymentObj?.currencyName}' , ${transactionPaymentObj?.clientLastUpdated} , '${transactionPaymentObj?.dateAdded}' , '${transactionPaymentObj?.dateUpdated}' , '${transactionPaymentObj?.updatedBy}' , '${transactionPaymentObj?.modeOfPayment}')`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery?.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into transaction`
      );

      if (result.changes === 1) {
        console.log("transaction inserted successfully!");
        const transactionDetailsRes = getSingleTransactionPaymentDetails(
          result.lastInsertRowid
        );
        console.log("transactionDetailsRes... = ", transactionDetailsRes);
        if (transactionDetailsRes) {
          for (let i = 0; i < transactionPaymentObj?.salesDetail?.length; i++) {
            let salesDetailObj = {
              ...transactionPaymentObj?.salesDetail[i],
              discountVal: transactionPaymentObj?.salesDetail[i].discountValue
                ? transactionPaymentObj?.salesDetail[i].discountValue
                : 0,
              isDeleted: 0,
              isSync: 0,
              paymentId: transactionDetailsRes.paymentId,
              storeId: transactionDetailsRes?.storeId,
            };
            // let SalesDetailsObj = {
            //   salesDetailsId: transactionPaymentObj?.salesDetail[i]?.salesDetailsId,
            //   paymentId: transactionDetailsRes.paymentId,
            //   productId: transactionPaymentObj?.salesDetail[i].productId,
            //   productName: transactionPaymentObj?.salesDetail[i].productName,
            //   purchasingPrice: transactionPaymentObj?.salesDetail[i].purchasingPrice,
            //   modeOfPayment: transactionPaymentObj?.salesDetail[i]?.modeOfPayment, //or Refund
            //   currencyName: transactionPaymentObj?.salesDetail[i]?.currencyName,
            //   currencyId: 0,
            //   discountVal: transactionPaymentObj?.salesDetail[i].discountValue,
            //   salesPrice: transactionPaymentObj?.salesDetail[i].salesPrice,
            //   salesQuantity: transactionPaymentObj?.salesDetail[i].salesQuantity,
            //   salestotalAmount: transactionPaymentObj?.salesDetail[i].salestotalAmount,
            //   taxValue: transactionPaymentObj?.salesDetail[i].taxPercent
            //     ? transactionPaymentObj?.salesDetail[i].taxPercent
            //     : 0,
            //   isDeleted: 0,
            //   isSync: 0,
            //   storeId: transactionDetailsRes?.storeId,
            //   clientLastUpdated: transactionPaymentObj?.salesDetail[i]?.clientLastUpdated,
            //   unitId: transactionPaymentObj?.salesDetail[i]?.unitId,
            //   unitName: transactionPaymentObj?.salesDetail[i]?.unitName,
            //   lastUpdate: transactionPaymentObj?.salesDetail[i]?.lastUpdate,
            // };
            // console.log("SalesDetailsObj...res ", SalesDetailsObj);
            //   //   sales details insert API call here
            const result = salesDetailsDB?.inserSalesDetails(salesDetailObj);
            console.log("salesDetailResult... ", result);
          }

          // let SalesDetailsObj = {
          //   salesDetailsId: transactionPaymentObj?.salesDetail[0]?.clientLastUpdated + 1,
          //   paymentId: transactionDetailsRes.paymentId,
          //   productId: transactionPaymentObj?.salesDetail[0].productId,
          //   productName: transactionPaymentObj?.salesDetail[0].productName,
          //   purchasingPrice: transactionPaymentObj?.salesDetail[0].purchasingPrice,
          //   modeOfPayment: transactionPaymentObj?.salesDetail[0]?.modeOfPayment, //or Refund
          //   currencyName: transactionPaymentObj?.salesDetail[0]?.currencyName,
          //   currencyId: 0,
          //   discountVal: 0,
          //   salesPrice: transactionPaymentObj?.salesDetail[0].salesPrice,
          //   salesQuantity: transactionPaymentObj?.salesDetail[0].salesQuantity,
          //   salestotalAmount: transactionPaymentObj?.salesDetail[0].salestotalAmount,
          //   taxValue: transactionPaymentObj?.salesDetail[0].taxPercent
          //     ? transactionPaymentObj?.salesDetail[0].taxPercent
          //     : 0,
          //   isDeleted: 0,
          //   isSync: 0,
          //   storeId: transactionDetailsRes?.storeId,
          //   clientLastUpdated: transactionPaymentObj?.salesDetail[0]?.clientLastUpdated,
          //   unitId: 0,
          //   unitName: "",
          //   lastUpdate: transactionPaymentObj?.salesDetail[0]?.clientLastUpdated,
          // };
          // console.log("SalesDetailsObj...res ", SalesDetailsObj);
          //   sales details insert API call here
          // const result = salesDetailsDB?.inserSalesDetails(SalesDetailsObj);
        }
      } else {
        console.error("Error adding transaction.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTransactionPayment = (transactionPaymentObj) => {
  console.log("transactionPaymentObjUPDATE... ", transactionPaymentObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE transactionpayment SET finaltotalAmount = ? , customerName = ? , customerId = ? , salesExecutiveName = ? , sales_executiveId = ? , totalAmount = ? , totalBalance = ? , totalPayment = ? , transaction_typeName = ? , userName = ? , storeId = ? , isSync = ? , notes = ? , mobileNumber = ? , isDeleted = ? , discount = ? , currencyName = ? , clientLastUpdated = ? , dateAdded = ? , dateUpdated = ? , updatedBy = ? , modeOfPayment = ? WHERE paymentId = ?`
    );

    const result = updateQuery.run(
      transactionPaymentObj?.finaltotalAmount,
      transactionPaymentObj?.customerName,
      transactionPaymentObj?.customerId,
      transactionPaymentObj?.salesExecutiveName,
      transactionPaymentObj?.sales_executiveId,
      transactionPaymentObj?.totalAmount,
      transactionPaymentObj?.totalBalance,
      transactionPaymentObj?.totalPayment,
      transactionPaymentObj?.transaction_typeName,
      transactionPaymentObj?.userName,
      transactionPaymentObj?.storeId,
      transactionPaymentObj?.isSync,
      transactionPaymentObj?.notes,
      transactionPaymentObj?.mobileNumber,
      transactionPaymentObj?.isDeleted,
      transactionPaymentObj?.discount,
      transactionPaymentObj?.currencyName,
      transactionPaymentObj?.clientLastUpdated,
      transactionPaymentObj?.dateAdded,
      transactionPaymentObj?.dateUpdated,
      transactionPaymentObj?.updatedBy,
      transactionPaymentObj?.modeOfPayment,
      transactionPaymentObj?.paymentId
    );
    if (result.changes === 1) {
      console.log("TransactionPayment updated successfully!");
    } else {
      console.error(
        "Error updating transactionPayment. No records were changed."
      );
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSingleTransactionPaymentDetails = (paymentId) => {
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM transactionpayment WHERE paymentId = ?"
    );
    const transactionPaymentDetails = selectQuery.get(paymentId);

    if (transactionPaymentDetails) {
      console.log(
        "Found transactionPaymentDetails:",
        transactionPaymentDetails
      );
    } else {
      console.log("transactionPaymentDetails not found");
    }
    return transactionPaymentDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get transaction payment list which has isSync value 0
const getTrasactionPaymentNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM transactionpayment WHERE isSync = ?"
    );
    const transactionPaymentNotSyncList = selectQuery.all(isSyncValue);

    if (transactionPaymentNotSyncList) {
      console.log(
        "Found transactionPaymentNotSyncList:",
        transactionPaymentNotSyncList
      );
    } else {
      console.log("transactionPaymentNotSyncList not found");
    }
    return transactionPaymentNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update data after sync completeion
const updateSyncTransantionPayment = (paymentTransactions) => {
  console.log("paymentTransactions... ", paymentTransactions);
  paymentTransactions &&
    paymentTransactions?.map((item) => {
      const transactionPaymentObj = {
        finaltotalAmount: item?.finaltotalAmount,
        customerName: item?.customerName,
        customerId: item?.customerId,
        salesExecutiveName: item?.salesExecutiveName,
        sales_executiveId: item?.sales_executiveId,
        totalAmount: item?.totalAmount,
        totalBalance: item?.totalBalance,
        totalPayment: item?.totalPayment,
        transaction_typeName: item?.transaction_typeName,
        userName: item?.userName,
        storeId: item?.storeId,
        isSync: 1,
        notes: item?.notes,
        mobileNumber: item?.mobileNumber,
        isDeleted: item?.isDeleted,
        discount: item?.discount,
        currencyName: item?.currencyName,
        clientLastUpdated: item?.clientLastUpdated,
        dateAdded: item?.dateAdded,
        dateUpdated: item?.dateUpdated,
        updatedBy: item?.updatedBy,
        modeOfPayment: item?.modeOfPayment,
        paymentId: item?.paymentId,
      };

      console.log("transactionPaymentObj... ", transactionPaymentObj);

      try {
        // const updateQuery = db.prepare(
        //   `UPDATE transactionpayment SET finaltotalAmount = ? , customerName = ? , customerId = ? , salesExecutiveName = ? , sales_executiveId = ? , totalAmount = ? , totalBalance = ? , totalPayment = ? , transaction_typeName = ? , userName = ? , storeId = ? , isSync = ? , notes = ? , mobileNumber = ? , isDeleted = ? , discount = ? , currencyName = ? , clientLastUpdated = ? , dateAdded = ? , dateUpdated = ? , updatedBy = ? , modeOfPayment = ? WHERE paymentId = ?`
        // );

        const insertOrUpdateQuery = db.prepare(
          `INSERT OR REPLACE INTO transactionpayment (paymentId, finaltotalAmount, customerName, customerId, salesExecutiveName, sales_executiveId, totalAmount, totalBalance, totalPayment, transaction_typeName, userName, storeId, isSync, notes, mobileNumber, isDeleted, discount, currencyName, clientLastUpdated, dateAdded, dateUpdated, updatedBy, modeOfPayment) VALUES (${transactionPaymentObj?.paymentId} , ${transactionPaymentObj?.finaltotalAmount} , '${transactionPaymentObj?.customerName}' , ${transactionPaymentObj?.customerId} , '${transactionPaymentObj?.salesExecutiveName}' , ${transactionPaymentObj?.sales_executiveId} , ${transactionPaymentObj?.totalAmount} , ${transactionPaymentObj?.totalBalance} , ${transactionPaymentObj?.totalPayment} , '${transactionPaymentObj?.transaction_typeName}' , '${transactionPaymentObj?.userName}' , ${transactionPaymentObj?.storeId} ,${transactionPaymentObj?.isSync} , '${transactionPaymentObj?.notes}' , '${transactionPaymentObj?.mobileNumber}' , ${transactionPaymentObj?.isDeleted} , ${transactionPaymentObj?.discount} , '${transactionPaymentObj?.currencyName}' , ${transactionPaymentObj?.clientLastUpdated} , '${transactionPaymentObj?.dateAdded}' , '${transactionPaymentObj?.dateUpdated}' , '${transactionPaymentObj?.updatedBy}' , '${transactionPaymentObj?.modeOfPayment}')`
        );
        let result;
        const transaction = db.transaction(() => {
          result = insertOrUpdateQuery?.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into transaction`
          );

          if (result.changes === 1) {
            console.log("transaction INSERT OR REPLACE successfully!");
            const transactionDetailsRes = getSingleTransactionPaymentDetails(
              result.lastInsertRowid
            );
            console.log("transactionDetailsRes... = ", transactionDetailsRes);
            if (transactionDetailsRes) {
              let SalesDetailsObj = {
                salesDetailsId: transactionPaymentObj?.clientLastUpdated + 1,
                paymentId: transactionDetailsRes.paymentId,
                productId: transactionPaymentObj.productId,
                productName: transactionPaymentObj.productName,
                purchasingPrice: transactionPaymentObj.purchasingPrice,
                modeOfPayment: transactionPaymentObj?.modeOfPayment, //or Refund
                currencyName: transactionPaymentObj?.currencyName,
                currencyId: 0,
                discountVal: 0,
                salesPrice: transactionPaymentObj.salesPrice,
                salesQuantity: transactionPaymentObj.salesQuantity,
                salestotalAmount: transactionPaymentObj.salestotalAmount,
                taxValue: transactionPaymentObj.taxPercent
                  ? transactionPaymentObj.taxPercent
                  : 0,
                isDeleted: 0,
                isSync: 1,
                storeId: transactionPaymentObj?.storeId,
                clientLastUpdated: transactionPaymentObj?.clientLastUpdated,
              };
              console.log("SyncSalesDetailsObj...res ", SalesDetailsObj);
              //   sales details insert API call here
              const result =
                salesDetailsDB?.updateSyncSalesDetails(SalesDetailsObj);
            }
          } else {
            console.error("Error adding transaction.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery.run(
        //   transactionPaymentObj?.finaltotalAmount,
        //   transactionPaymentObj?.customerName,
        //   transactionPaymentObj?.customerId,
        //   transactionPaymentObj?.salesExecutiveName,
        //   transactionPaymentObj?.sales_executiveId,
        //   transactionPaymentObj?.totalAmount,
        //   transactionPaymentObj?.totalBalance,
        //   transactionPaymentObj?.totalPayment,
        //   transactionPaymentObj?.transaction_typeName,
        //   transactionPaymentObj?.userName,
        //   transactionPaymentObj?.storeId,
        //   transactionPaymentObj?.isSync,
        //   transactionPaymentObj?.notes,
        //   transactionPaymentObj?.mobileNumber,
        //   transactionPaymentObj?.isDeleted,
        //   transactionPaymentObj?.discount,
        //   transactionPaymentObj?.currencyName,
        //   transactionPaymentObj?.clientLastUpdated,
        //   transactionPaymentObj?.dateAdded,
        //   transactionPaymentObj?.dateUpdated,
        //   transactionPaymentObj?.updatedBy,
        //   transactionPaymentObj?.modeOfPayment,
        //   transactionPaymentObj?.paymentId
        // );
        // if (result.changes === 1) {
        //   console.log("TransactionPayment sync updated successfully!");
        // } else {
        //   console.error(
        //     "Error updating transactionPayment. No records were changed."
        //   );
        // }
        // return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  toHardDeleteTransactionPayment();
};

const toHardDeleteTransactionPayment = () => {
  try {
    const deleteQuery = db.prepare(
      "DELETE from transactionpayment WHERE isDeleted = 1"
    );
    const deletedList = deleteQuery.run();
    if (brandDetails) {
      console.log("Transactionpayment hard deleted successfully!");
    } else {
      console.log("Brand not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllTransactionPayment = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS transactionpayment (
              paymentId INTEGER PRIMARY KEY,
              finaltotalAmount INTEGER,
              customerName TEXT,
              customerId INTEGER DEFAULT (0),
              salesExecutiveName TEXT,
              sales_executiveId INTEGER,
              totalAmount INTEGER,
              totalBalance INTEGER,
              totalPayment INTEGER DEFAULT (0),
              transaction_typeName TEXT,
              userName TEXT,
              storeId INTEGER,
              isSync INTEGER DEFAULT (0),
              notes TEXT,
              mobileNumber TEXT,
              isDeleted INTEGER DEFAULT (0),
              discount INTEGER DEFAULT (0),
              currencyName TEXT,
              clientLastUpdated INTEGER,
              dateAdded TEXT,
              dateUpdated TEXT,
              updatedBy TEXT,
              modeOfPayment TEXT
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const deleteQuery = db.prepare("DELETE FROM transactionpayment");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All transactionpayments are deleted successfully!");
    } else {
      console.log("transactionpayment not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getTransactionList,
  insertTransactionPayment,
  updateTransactionPayment,
  getSingleTransactionPaymentDetails,
  getTrasactionPaymentNotSyncList,
  updateSyncTransantionPayment,
  toHardDeleteTransactionPayment,
  deleteAllTransactionPayment,
  getTransactionPaymentByMonth,
  getTransactionPaymentByDate,
};
