const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all customers
const getAllCustomers = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
     CREATE TABLE IF NOT EXISTS customer (
       customerId INTEGER PRIMARY KEY,
       customerName TEXT,
       email TEXT,
       mobileNumber TEXT,
       address TEXT,
       city TEXT,
       country TEXT,
       notes TEXT,
       lastUpdate INTEGER DEFAULT (0),
       isDeleted INTEGER DEFAULT (0),
       addedBy TEXT,
       updatedBy TEXT,
       storeId INTEGER DEFAULT (-1),
       isSync INTEGER DEFAULT (0)
     )
     `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM customer";
    const readyQuery = db?.prepare(query);
    const customerList = readyQuery?.all();
    console.log("customerList ", customerList);
    return customerList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert customer into sqlite database
const insertCustomer = (customerObj) => {
  // console.log("customerObj... ", customerObj)
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS customer (
          customerId INTEGER PRIMARY KEY,
          customerName TEXT,
          email TEXT,
          mobileNumber TEXT,
          address TEXT,
          city TEXT,
          country TEXT,
          notes TEXT,
          lastUpdate INTEGER DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          addedBy TEXT,
          updatedBy TEXT,
          storeId INTEGER DEFAULT (-1),
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO customer (customerId , customerName , email , mobileNumber , address , city , country , notes , lastUpdate , isDeleted, addedBy , updatedBy , storeId , isSync) VALUES (${customerObj?.customerId} , '${customerObj?.customerName}' , '${customerObj?.email}' , '${customerObj?.mobileNumber}' , '${customerObj?.address}' , '${customerObj?.city}' , '${customerObj?.country}' , '${customerObj?.notes}' , ${customerObj?.lastUpdate} , ${customerObj?.isDeleted} , '${customerObj?.addedBy}' , '${customerObj?.updatedBy}' , ${customerObj?.storeId} , ${customerObj?.isSync})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into customer`
      );

      if (result.changes === 1) {
        console.log("Customer inserted successfully!");
      } else {
        console.error("Error adding customer.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update customer into sqlite database
const updateCustomer = (customerObj) => {
  console.log("customerObj... ", customerObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE customer SET customerName  = ? , email  = ? , mobileNumber  = ? , address  = ? , city  = ? , country  = ? , notes  = ? , lastUpdate  = ? , isDeleted = ? , addedBy  = ? , updatedBy  = ? , storeId  = ? , isSync = ? WHERE customerId = ? `
    );

    const result = updateQuery.run(
      customerObj?.customerName,
      customerObj?.email,
      customerObj?.mobileNumber,
      customerObj?.address,
      customerObj?.city,
      customerObj?.country,
      customerObj?.notes,
      customerObj?.lastUpdate,
      customerObj?.isDeleted,
      customerObj?.addedBy,
      customerObj?.updatedBy,
      customerObj?.storeId,
      customerObj?.isSync,
      customerObj?.customerId
    );
    console.log(
      `Updated ${result.changes} rows with last ID ${result.lastInsertRowid} into customer`
    );

    if (result.changes === 1) {
      console.log("Customer Updated successfully!");
      return result;
    } else {
      console.error("Error adding customer.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get customer details by id
const getCategoryDetailsById = (customerId) => {
  try {
    const query = db.prepare("SELECT * FROM customer WHERE customerId = ?");
    const selectedCustomer = query?.get(customerId);
    if (selectedCustomer) {
      console.log("Found selectedCustomer:", selectedCustomer);
    } else {
      console.log("selectedCustomer not found");
    }
    return selectedCustomer;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete customer by id from sqlite database
const deleteCustomerById = (customerId) => {
  try {
    const query = "DELETE FROM customer WHERE customerId = ?";
    const readQuery = db.prepare(query);
    const deletedQuery = readQuery?.run(customerId);
    if (deletedQuery) {
      console.log("Customer deleted successfully!");
      return deletedQuery;
    } else {
      console.log("Customer not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCustomerNotSyncList = (isSyncValue) => {
  try {
    const query = db.prepare("SELECT * FROM customer WHERE isSync = ?");
    const customerNotSyncList = query?.all(isSyncValue);
    if (customerNotSyncList) {
      console.log("Found customerNotSyncList:", customerNotSyncList);
      return customerNotSyncList;
    } else {
      console.log("customerNotSyncList not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncCustomer = (customers, storeId) => {
  console.log("customers... ", customers);

  customers &&
    customers?.map((item) => {
      const customerObj = {
        customerName: item?.customerName,
        email: item?.email ? item?.email : "",
        mobileNumber: item?.mobileNumber ? item?.mobileNumber : "",
        address: item?.address ? item?.address : "",
        city: item?.city ? item?.city : "",
        country: item?.country ? item?.country : "",
        notes: item?.notes ? item?.notes : "",
        lastUpdate: item?.lastUpdate,
        isDeleted: item?.isDeleted,
        addedBy: item?.addedBy ? item?.addedBy : "",
        updatedBy: item?.updatedBy ? item?.updatedBy : "",
        storeId: storeId,
        isSync: 1,
        customerId: item?.customerId,
      };
      // console.log("customerObj... ", customerObj)

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO customer (customerId , customerName , email , mobileNumber , address , city , country , notes , lastUpdate , isDeleted, addedBy , updatedBy , storeId , isSync) VALUES (${customerObj?.customerId} , '${customerObj?.customerName}' , '${customerObj?.email}' , '${customerObj?.mobileNumber}' , '${customerObj?.address}' , '${customerObj?.city}' , '${customerObj?.country}' , '${customerObj?.notes}' , ${customerObj?.lastUpdate} , ${customerObj?.isDeleted} , '${customerObj?.addedBy}' , '${customerObj?.updatedBy}' , ${customerObj?.storeId} , ${customerObj?.isSync})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into customer`
          );

          if (result.changes === 1) {
            console.log("Customer INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding customer.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery.run(
        //   customerObj?.customerName,
        //   customerObj?.email,
        //   customerObj?.mobileNumber,
        //   customerObj?.address,
        //   customerObj?.city,
        //   customerObj?.country,
        //   customerObj?.notes,
        //   customerObj?.lastUpdate,
        //   customerObj?.isDeleted,
        //   customerObj?.addedBy,
        //   customerObj?.updatedBy,
        //   customerObj?.storeId,
        //   customerObj?.isSync,
        //   customerObj?.customerId
        // );
        // console.log(
        //   `Updated ${result.changes} rows with last ID ${result.lastInsertRowid} into customer`
        // );

        // if (result.changes === 1) {
        //   console.log("Customer sync updated successfully!");
        //   return result
        // } else {
        //   console.error("Error adding customer.");
        // }
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  toHardDeleteCustomer();
};

const toHardDeleteCustomer = () => {
  try {
    const query = "DELETE FROM customer WHERE isDeleted = 1";
    const readQuery = db.prepare(query);
    const deletedQuery = readQuery?.run();
    if (deletedQuery) {
      console.log("Customer hard deleted successfully!");
      return deletedQuery;
    } else {
      console.log("Customer not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllCustomer = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM customer");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All customers are deleted successfully!");
    } else {
      console.log("customer not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllCustomers,
  insertCustomer,
  updateCustomer,
  getCategoryDetailsById,
  deleteCustomerById,
  getCustomerNotSyncList,
  updateSyncCustomer,
  toHardDeleteCustomer,
  deleteAllCustomer,
};
