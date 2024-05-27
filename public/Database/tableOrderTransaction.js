const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getTableOrders = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tableOrderTransaction (
          tableOrderId INTEGER PRIMARY KEY,
          tableId INTEGER,
          waiterId INTEGER,
          waiterName TEXT,
          orderId INTEGER,
          orderNo INTEGER DEFAULT (0),
          category TEXT,
          startDate INTEGER,
          subTotal INTEGER DEFAULT (0),
          taxAmount INTEGER DEFAULT (0),
          charges INTEGER DEFAULT (0),
          quantity INTEGER DEFAULT (0),
          finalTotal INTEGER DEFAULT (0),
          customerId INTEGER,
          discount INTEGER DEFAULT (0),
          userName TEXT,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          tableName TEXT,
          tableSeatingCount INTEGER DEFAULT (0),
          customerName TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    // only getting not deleted selected tables
    const query = "SELECT * FROM tableOrderTransaction WHERE isDeleted = 0";
    const readQuery = db.prepare(query);
    const tableOrders = readQuery.all();

    return tableOrders;
  } catch (error) {
    console.log("error ", error);
  }
};

const insertTableOrder = (tableOrderObj) => {
  console.log("tableOrderObj... ", tableOrderObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tableOrderTransaction (
          tableOrderId INTEGER PRIMARY KEY,
          tableId INTEGER,
          waiterId INTEGER,
          waiterName TEXT,
          orderId INTEGER,
          orderNo INTEGER DEFAULT (0),
          category TEXT,
          startDate INTEGER,
          subTotal INTEGER DEFAULT (0),
          taxAmount INTEGER DEFAULT (0),
          charges INTEGER DEFAULT (0),
          quantity INTEGER DEFAULT (0),
          finalTotal INTEGER DEFAULT (0),
          customerId INTEGER,
          discount INTEGER DEFAULT (0),
          userName TEXT,
          storeId INTEGER,
          isSync INTEGER DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          tableName TEXT,
          tableSeatingCount INTEGER DEFAULT (0),
          customerName TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      "INSERT INTO tableOrderTransaction (tableOrderId, tableId, waiterId, waiterName, orderId, orderNo, category, startDate, subTotal, taxAmount, charges, quantity, finalTotal, customerId, discount, userName, storeId, isSync, isDeleted, tableName, tableSeatingCount, customerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    let result;
    const trasaction = db.transaction(() => {
      result = insertQuery.run(
        tableOrderObj?.tableOrderId,
        tableOrderObj?.tableId,
        tableOrderObj?.waiterId,
        tableOrderObj?.waiterName,
        tableOrderObj?.orderId,
        tableOrderObj?.orderNo,
        tableOrderObj?.category,
        tableOrderObj?.startDate,
        tableOrderObj?.subTotal,
        tableOrderObj?.taxAmount,
        tableOrderObj?.charges,
        tableOrderObj?.quantity,
        tableOrderObj?.finalTotal,
        tableOrderObj?.customerId,
        tableOrderObj?.discount,
        tableOrderObj?.userName,
        tableOrderObj?.storeId,
        tableOrderObj?.isSync,
        tableOrderObj?.isDeleted,
        tableOrderObj?.tableName,
        tableOrderObj?.tableSeatingCount,
        tableOrderObj?.customerName
      );

      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into tableOrderTransaction`
      );

      if (result.changes === 1) {
        console.log("tableOrderTransaction inserted successfully!");
        return result;
      } else {
        console.error("Error adding tableOrderTransaction.");
      }
    });

    trasaction();
    return result;
  } catch (error) {
    console.log("error ", error);
  }
};

const updateTableOrder = (tableOrderObj) => {
  console.log("updateTableOrderObj... ", tableOrderObj);
  try {
    const updateQuery = db.prepare(
      "UPDATE tableOrderTransaction SET tableId = ?, waiterId = ?, waiterName = ?, orderId = ?, orderNo = ?, category = ?, startDate = ?, subTotal = ?, taxAmount = ?, charges = ?, quantity = ?, finalTotal = ?, customerId = ?, discount = ?, userName = ?, storeId = ?, isSync = ?, isDeleted = ?, tableName = ?, tableSeatingCount = ?, customerName = ? WHERE tableOrderId = ?"
    );
    let result;

    result = updateQuery.run(
      tableOrderObj?.tableId,
      tableOrderObj?.waiterId,
      tableOrderObj?.waiterName,
      tableOrderObj?.orderId,
      tableOrderObj?.orderNo,
      tableOrderObj?.category,
      tableOrderObj?.startDate,
      tableOrderObj?.subTotal,
      tableOrderObj?.taxAmount,
      tableOrderObj?.charges,
      tableOrderObj?.quantity,
      tableOrderObj?.finalTotal,
      tableOrderObj?.customerId,
      tableOrderObj?.discount,
      tableOrderObj?.userName,
      tableOrderObj?.storeId,
      tableOrderObj?.isSync,
      tableOrderObj?.isDeleted,
      tableOrderObj?.tableName,
      tableOrderObj?.tableSeatingCount,
      tableOrderObj?.customerName,
      tableOrderObj?.tableOrderId
    );

    console.log(
      `Updated ${result.changes} rows with last ID ${result.lastInsertRowid} into TableOrderTransaction`
    );

    if (result.changes === 1) {
      console.log("TableOrderTransaction updated successfully!");
      return {...result, updated: "updated"};
    } else {
      console.error("Error update tableOrderTransaction.");
    }

    return result;
  } catch (error) {
    console.log("error ", error);
  }
};

const softDeleteTableOrder = (tableOrderId) => {
  try {
    // only getting not deleted selected tables
    const deleteQuery = "UPDATE tableOrderTransaction WHERE isDeleted = 1";
    const readQuery = db.prepare(deleteQuery);
    const tableOrders = readQuery.all();

    return tableOrders;
  } catch (error) {
    console.log("error ", error);
  }
};

const deleteAllTableOrder = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM tableOrderTransaction");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All tableOrderTransactions are deleted successfully!");
    } else {
      console.log("tableOrderTransaction not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getTableOrders,
  insertTableOrder,
  updateTableOrder,
  deleteAllTableOrder,
};
