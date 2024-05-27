const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getSplitTransactionList = () => {
  try {
        // Define the SQL command to create the table if it doesn't exist
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS splitPaymentTransaction (
          splitPaymentId INTEGER PRIMARY KEY,
          tableOrderId INTEGER,
          paymentId INTEGER,
          paymentDate INTEGER,
          paymentMode TEXT,
          amount INTEGER,
          totalAmount INTEGER,
          note TEXT,
          isSplit INTEGER DEFAULT (0),
          storeId INTEGER,
          isSync INTEGER DEFAULT (0),
          isDeleted INTEGER DEFAULT (0)
        )
    `;
    
        // Execute the SQL command to create the table
        db.exec(createTableQuery);
    const query = "SELECT * FROM splitPaymentTransaction";
    const readQuery = db.prepare(query);
    const splitPaymentTransactions = readQuery.all();

    return splitPaymentTransactions;
  } catch (error) {
    console.log("error ", error);
  }
};

const insertSplitTransaction = (splitPaymentObj) => {
  console.log("splitPaymentObj... ", splitPaymentObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS splitPaymentTransaction (
      splitPaymentId INTEGER PRIMARY KEY,
      tableOrderId INTEGER,
      paymentId INTEGER,
      paymentDate INTEGER,
      paymentMode TEXT,
      amount INTEGER,
      totalAmount INTEGER,
      note TEXT,
      isSplit INTEGER DEFAULT (0),
      storeId INTEGER,
      isSync INTEGER DEFAULT (0),
      isDeleted INTEGER DEFAULT (0)
    )
`;

    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO splitPaymentTransaction (splitPaymentId, tableOrderId, paymentId, paymentDate, paymentMode, amount, totalAmount, note, isSplit, storeId, isSync, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run(
        splitPaymentObj?.splitPaymentId,
        splitPaymentObj?.tableOrderId,
        splitPaymentObj?.paymentId,
        splitPaymentObj?.paymentDate,
        splitPaymentObj?.paymentMode,
        splitPaymentObj?.amount,
        splitPaymentObj?.totalAmount,
        splitPaymentObj?.note,
        splitPaymentObj?.isSplit,
        splitPaymentObj?.storeId,
        splitPaymentObj?.isSync,
        splitPaymentObj?.isDeleted
      );

      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into splitPaymentTransaction`
      );

      if (result.changes === 1) {
        console.log("splitPaymentTransaction inserted successfully!");
        return result;
      } else {
        console.error("Error adding splitPaymentTransaction.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.log("error ", error);
  }
};

const updateSplitTransaction = (splitPaymentObj) => {
  console.log("splitPaymentObj... ", splitPaymentObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE splitPaymentTransaction SET  tableOrderId = ?, paymentId = ?, paymentDate = ?, paymentMode = ?, amount = ?, totalAmount = ?, note = ?, isSplit = ?, storeId = ?, isSync = ?, isDeleted = ? WHERE splitPaymentId = ?`
    );

    let result;

    result = updateQuery.run(
      splitPaymentObj?.splitPaymentId,
      splitPaymentObj?.tableOrderId,
      splitPaymentObj?.paymentId,
      splitPaymentObj?.paymentDate,
      splitPaymentObj?.paymentMode,
      splitPaymentObj?.amount,
      splitPaymentObj?.totalAmount,
      splitPaymentObj?.note,
      splitPaymentObj?.isSplit,
      splitPaymentObj?.storeId,
      splitPaymentObj?.isSync,
      splitPaymentObj?.isDeleted
    );

    console.log(
      `Update ${result.changes} rows with last ID ${result.lastInsertRowid} into splitPaymentTransaction`
    );

    if (result.changes === 1) {
      console.log("splitPaymentTransaction update successfully!");
      return result;
    } else {
      console.error("Error updating splitPaymentTransaction.");
    }

    return result;
  } catch (error) {
    console.log("error ", error);
  }
};

const getSplitTransactionDetailsById = (splitPaymentId) => {
  try {
    const query =
      "SELECT * FROM splitPaymentTransaction WHERE splitPaymentId = ?";
    const readQuery = db.prepare(query);
    const selectedTransactionDetails = readQuery?.get(splitPaymentId);

    if (selectedTransactionDetails) {
      console.log(
        "Found selectedTransactionDetails:",
        selectedTransactionDetails
      );
    } else {
      console.log("selectedTransactionDetails not found");
    }
    return selectedTransactionDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteSplitTransactionById = (splitPaymentId) => {
  try {
    const query =
      "DELETE FROM splitPaymentTransaction WHERE splitPaymentId = ?";
    const readQuery = db.prepare(query);
    const deletedTransactionDetails = readQuery?.run(splitPaymentId);

    if (deletedTransactionDetails) {
      console.log(
        "Found deletedTransactionDetails:",
        deletedTransactionDetails
      );
    } else {
      console.log("deletedTransactionDetails not found");
    }
    return deletedTransactionDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllSplitTransaction = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM splitPaymentTransaction");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All splitPaymentTransactions are deleted successfully!");
    } else {
      console.log("splitPaymentTransaction not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getSplitTransactionList,
  insertSplitTransaction,
  updateSplitTransaction,
  getSplitTransactionDetailsById,
  deleteSplitTransactionById,
  deleteAllSplitTransaction,
};
