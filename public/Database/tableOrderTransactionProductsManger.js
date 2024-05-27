const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getTableOrderTransProductsList = (tableOrderId) => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tableOrderTransactionProducts (
          tableOrderId INTEGER,
          productId INTEGER,
          productName TEXT,
          sellingPrice INTEGER,
          purchasingPrice INTEGER,
          maxRetailPrice INTEGER,
          quantity INTEGER DEFAULT (0),
          expiryDate INTEGER,
          lastUpdate INTEGER,
          priceIncludeTax INTEGER DEFAULT (0),
          prQuantity INTEGER,
          productTax INTEGER DEFAULT (0),
          taxValue INTEGER DEFAULT (0),
          singleProTotal INTEGER,
          productDiscount INTEGER DEFAULT (0),
          taxPercent TEXT,
          kotCancelReason TEXT, 
          isDeleted INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    console.log("tableOrderId... ", tableOrderId);
    // only getting not deleted selected tables
    const query =
      "SELECT * FROM tableOrderTransactionProducts WHERE tableOrderId = ?";
    const readQuery = db.prepare(query);
    const tableOrderProductsList = readQuery.all(tableOrderId);
    let newList = [];
    let deletedTableProduct = getDeletedTableOrderProducts(tableOrderId);
    console.log("tableOrderProductsList... ", tableOrderProductsList);
    console.log("deletedTableProduct... ", deletedTableProduct);

    if (deletedTableProduct?.length > 0) {
      tableOrderProductsList &&
        tableOrderProductsList?.map((itemOne) => {
          deletedTableProduct &&
            deletedTableProduct?.map((itemTwo) => {
              if (itemOne?.isDeleted != 1) {
                let newObj = {
                  ...itemOne,
                  singleProTotal:
                    itemOne?.singleProTotal -
                    itemTwo?.sellingPrice * itemTwo?.prQuantity,
                };
                newList.push(newObj);
              }
            });
        });
    } else {
      newList = tableOrderProductsList;
    }

    return newList;
  } catch (error) {
    console.log("error ", error);
  }
};

const getDeletedTableOrderProducts = (tableOrderId) => {
  try {
    // only getting not deleted selected tables
    const query =
      "SELECT * FROM tableOrderTransactionProducts WHERE tableOrderId = ? AND isDeleted = 1";
    const readQuery = db.prepare(query);
    const tableOrderProductsList = readQuery.all(tableOrderId);

    return tableOrderProductsList;
  } catch (error) {
    console.log("error ", error);
  }
};

const insertTableOrderTransSingleProduct = (tableOrderProductObj) => {
  console.log("tableOrderProductObj... ", tableOrderProductObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tableOrderTransactionProducts (
              tableOrderId INTEGER,
              productId INTEGER,
              productName TEXT,
              sellingPrice INTEGER,
              purchasingPrice INTEGER,
              maxRetailPrice INTEGER,
              quantity INTEGER DEFAULT (0),
              expiryDate INTEGER,
              lastUpdate INTEGER,
              priceIncludeTax INTEGER DEFAULT (0),
              prQuantity INTEGER,
              productTax INTEGER DEFAULT (0),
              taxValue INTEGER DEFAULT (0),
              singleProTotal INTEGER,
              productDiscount INTEGER DEFAULT (0),
              taxPercent TEXT,
              kotCancelReason TEXT, 
              isDeleted INTEGER DEFAULT (0)
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO tableOrderTransactionProducts (tableOrderId, productId, productName, sellingPrice, purchasingPrice, maxRetailPrice, quantity, expiryDate, lastUpdate, priceIncludeTax, prQuantity, productTax, taxValue, singleProTotal, productDiscount, taxPercent, kotCancelReason, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run(
        tableOrderProductObj?.tableOrderId,
        tableOrderProductObj?.productId,
        tableOrderProductObj?.productName,
        tableOrderProductObj?.sellingPrice,
        tableOrderProductObj?.purchasingPrice,
        tableOrderProductObj?.maxRetailPrice,
        tableOrderProductObj?.quantity,
        tableOrderProductObj?.expiryDate,
        tableOrderProductObj?.lastUpdate,
        tableOrderProductObj?.priceIncludeTax,
        tableOrderProductObj?.prQuantity,
        tableOrderProductObj?.productTax,
        tableOrderProductObj?.taxValue,
        tableOrderProductObj?.singleProTotal,
        tableOrderProductObj?.productDiscount,
        tableOrderProductObj?.taxPercent,
        tableOrderProductObj?.kotCancelReason,
        tableOrderProductObj?.isDeleted
      );
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

const insertTableOrderTransProducts = (tableOrderProductArray) => {
  console.log("tableOrderProductArray... ", tableOrderProductArray);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tableOrderTransactionProducts (
              tableOrderId INTEGER,
              productId INTEGER,
              productName TEXT,
              sellingPrice INTEGER,
              purchasingPrice INTEGER,
              maxRetailPrice INTEGER,
              quantity INTEGER DEFAULT (0),
              expiryDate INTEGER,
              lastUpdate INTEGER,
              priceIncludeTax INTEGER DEFAULT (0),
              prQuantity INTEGER,
              productTax INTEGER DEFAULT (0),
              taxValue INTEGER DEFAULT (0),
              singleProTotal INTEGER,
              productDiscount INTEGER DEFAULT (0),
              taxPercent TEXT,
              kotCancelReason TEXT, 
              isDeleted INTEGER DEFAULT (0)
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO tableOrderTransactionProducts (tableOrderId, productId, productName, sellingPrice, purchasingPrice, maxRetailPrice, quantity, expiryDate, lastUpdate, priceIncludeTax, prQuantity, productTax, taxValue, singleProTotal, productDiscount, taxPercent, kotCancelReason, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    
    let totalChanges = 0;
    
    tableOrderProductArray.forEach(tableOrderProductObj => {
      const result = insertQuery.run(
        tableOrderProductObj?.tableOrderId,
        tableOrderProductObj?.productId,
        tableOrderProductObj?.productName,
        tableOrderProductObj?.sellingPrice,
        tableOrderProductObj?.purchasingPrice,
        tableOrderProductObj?.maxRetailPrice,
        tableOrderProductObj?.quantity,
        tableOrderProductObj?.expiryDate,
        tableOrderProductObj?.lastUpdate,
        tableOrderProductObj?.priceIncludeTax,
        tableOrderProductObj?.prQuantity,
        tableOrderProductObj?.productTax,
        tableOrderProductObj?.taxValue,
        tableOrderProductObj?.singleProTotal,
        tableOrderProductObj?.productDiscount,
        tableOrderProductObj?.taxPercent,
        tableOrderProductObj?.kotCancelReason,
        tableOrderProductObj?.isDeleted
      );
      
      totalChanges += result.changes;
      
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into tableOrderTransactionProducts`
      );

      if (result.changes === 1) {
        console.log("Row inserted successfully!");
      } else {
        console.error("Error adding row.");
      }
    });

    console.log(`Total ${totalChanges} rows inserted into tableOrderTransactionProducts`);

    return totalChanges;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTableOrderSignleProd = (tableOrderSoftDeleteObj) => {
  console.log("updateTableOrderSignleProd... ", tableOrderSoftDeleteObj);
  try {
    // only getting not deleted selected tables
    const query =
      "UPDATE tableOrderTransactionProducts SET productName = ?, sellingPrice = ?, purchasingPrice = ?, maxRetailPrice = ?, quantity = ?, expiryDate = ?, lastUpdate = ?, priceIncludeTax = ?, prQuantity = ?, productTax = ?, taxValue = ?, singleProTotal = ?, productDiscount = ?, taxPercent = ?, kotCancelReason = ?, isDeleted = ? WHERE tableOrderId = ? AND productId = ?";
    const updateQuery = db.prepare(query);
    const tableOrderProductsList = updateQuery.run(
      tableOrderSoftDeleteObj?.productName,
      tableOrderSoftDeleteObj?.sellingPrice,
      tableOrderSoftDeleteObj?.purchasingPrice,
      tableOrderSoftDeleteObj?.maxRetailPrice,
      tableOrderSoftDeleteObj?.quantity,
      tableOrderSoftDeleteObj?.expiryDate,
      tableOrderSoftDeleteObj?.lastUpdate,
      tableOrderSoftDeleteObj?.priceIncludeTax,
      tableOrderSoftDeleteObj?.prQuantity,
      tableOrderSoftDeleteObj?.productTax,
      tableOrderSoftDeleteObj?.taxValue,
      tableOrderSoftDeleteObj?.singleProTotal,
      tableOrderSoftDeleteObj?.productDiscount,
      tableOrderSoftDeleteObj?.taxPercent,
      tableOrderSoftDeleteObj?.kotCancelReason,
      tableOrderSoftDeleteObj?.isDeleted,
      tableOrderSoftDeleteObj?.tableOrderId,
      tableOrderSoftDeleteObj?.productId
    );

    if (tableOrderProductsList.changes === 1) {
      console.log("tableOrderTransactionProducts updated successfully!");
      return tableOrderProductsList;
    } else {
      console.error("Error update tableOrderTransactionProducts.");
    }

    return tableOrderProductsList;
  } catch (error) {
    console.log("error ", error);
  }
};

const deleteAllTableOrderTransactionProducts = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM tableOrderTransactionProducts");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log(
        "All tableOrderTransactionProducts are deleted successfully!"
      );
    } else {
      console.log("tableOrderTransactionProducts not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getTableOrderTransProductsList,
  insertTableOrderTransProducts,
  insertTableOrderTransSingleProduct,
  updateTableOrderSignleProd,
  deleteAllTableOrderTransactionProducts,
};
