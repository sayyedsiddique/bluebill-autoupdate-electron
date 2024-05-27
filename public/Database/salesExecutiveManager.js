const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all salesExecutive
const getAllSalesExecutive = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS salesExecutive (
          id INTEGER PRIMARY KEY,
          name TEXT,
          activated INTEGER DEFAULT (0), 
          isSync INTEGER DEFAULT (0), 
          storeId INTEGER DEFAULT (0), 
          isDeleted INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM salesExecutive";
    const readQuery = db.prepare(query);
    const salesExecutiveList = readQuery?.all();
    console.log("salesExecutiveList... ", salesExecutiveList);
    return salesExecutiveList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert data into sqlite database
const insertSalesExecutive = (salesExecutiveObj) => {
  console.log("salesExecutiveObj... ", salesExecutiveObj)
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS salesExecutive (
              id INTEGER PRIMARY KEY,
              name TEXT,
              activated INTEGER DEFAULT (0), 
              isSync INTEGER DEFAULT (0), 
              storeId INTEGER DEFAULT (0), 
              isDeleted INTEGER DEFAULT (0)
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO salesExecutive (id, name, activated, isSync, storeId, isDeleted) VALUES (${salesExecutiveObj?.id} , '${salesExecutiveObj?.name}' , ${salesExecutiveObj?.activated} , ${salesExecutiveObj?.isSync} , ${salesExecutiveObj?.storeId} , ${salesExecutiveObj?.isDeleted})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into salesExecutive`
      );

      if (result.changes === 1) {
        console.log("SalesExecutive inserted successfully!");
      } else {
        console.error("Error adding salesExecutive.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert data into sqlite database
const updateSalesExecutive = (salesExecutiveObj) => {
  console.log("salesExecutiveObj ", salesExecutiveObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE salesExecutive SET name = ? , activated = ? , isSync = ? , storeId = ? , isDeleted = ? WHERE id = ?`
    );

    const result = updateQuery.run(
      salesExecutiveObj?.name,
      salesExecutiveObj?.activated,
      salesExecutiveObj?.isSync,
      salesExecutiveObj?.storeId,
      salesExecutiveObj?.isDeleted,
      salesExecutiveObj?.id
    );
    console.log(
      `Update ${result.changes} rows with last ID ${result.lastInsertRowid} into salesExecutive`
    );

    if (result.changes === 1) {
      console.log("SalesExecutive update successfully!");
    } else {
      console.error("Error adding salesExecutive.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get sales executive details by id
const getSalesExecutiveDetailsById = (salesExecutiveId) => {
  try {
    const query = "SELECT * FROM salesExecutive WHERE id = ?";
    const readQuery = db.prepare(query);
    const selectedSalesExecutive = readQuery?.get(salesExecutiveId);

    if (selectedSalesExecutive) {
      console.log("Found selectedSalesExecutive:", selectedSalesExecutive);
    } else {
      console.log("selectedSalesExecutive not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete sales executive by id
const deleteSalesExecutiveById = (salesExecutiveId) => {
  try {
    const query = "DELETE FROM SalesExecutive WHERE id = ?";
    const readQuery = db?.prepare(query);
    const deleteSalesExecutive = readQuery?.run(salesExecutiveId);

    if (deleteSalesExecutive) {
      console.log("SalesExecutive deleted successfully!");
    } else {
      console.log("SalesExecutive not found");
    }
    return deleteSalesExecutive;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSalesExeNotSyncList = (isSyncValue) => {
  try {
    const query = "SELECT * FROM salesExecutive WHERE isSync = ?";
    const readQuery = db.prepare(query);
    const salesExeNotSyncList = readQuery?.all(isSyncValue);

    if (salesExeNotSyncList) {
      console.log("Found salesExeNotSyncList:", salesExeNotSyncList);
    } else {
      console.log("salesExeNotSyncList not found");
    }
    return salesExeNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncSalesExecutive = (salesExecutives, storeID) => {
  console.log("salesExecutives... ", salesExecutives);

  salesExecutives &&
    salesExecutives?.map((item) => {
      const activatedValue =
        item?.activated === "Y" || item?.activated === 1 ? 1 : 0;

      const salesExecutiveObj = {
        id: item?.id,
        name: item?.name,
        activated: activatedValue,
        isSync: 1,
        storeId: storeID,
        isDeleted: 0,
      };

      try {
        // const updateQuery = db.prepare(
        //   `UPDATE salesExecutive SET name = ? , activated = ? , isSync = ? , storeId = ? , isDeleted = ? WHERE id = ?`
        // );

        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO salesExecutive (id, name, activated, isSync, storeId, isDeleted) VALUES (${salesExecutiveObj?.id}, '${salesExecutiveObj?.name}', ${salesExecutiveObj?.activated}, ${salesExecutiveObj?.isSync}, ${salesExecutiveObj.storeId}, ${salesExecutiveObj?.isDeleted})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into salesExecutive`
          );

          if (result.changes === 1) {
            console.log("SalesExecutive INSERT OR REPLACE INTO successfully!");
          } else {
            console.error("Error adding salesExecutive.");
          }
        });
        transaction();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  toHeardDeleteSalesExecutive();
};

const toHeardDeleteSalesExecutive = () => {
  try {
    const query = "DELETE FROM SalesExecutive WHERE isDeleted = 1";
    const readQuery = db?.prepare(query);
    const deleteSalesExecutive = readQuery?.run();

    if (deleteSalesExecutive) {
      console.log("SalesExecutive hard deleted successfully!");
    } else {
      console.log("SalesExecutive not found");
    }
    return deleteSalesExecutive;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllSalesExecutive = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM SalesExecutive");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All SalesExecutives are deleted successfully!");
    } else {
      console.log("SalesExecutive not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllSalesExecutive,
  insertSalesExecutive,
  updateSalesExecutive,
  getSalesExecutiveDetailsById,
  deleteSalesExecutiveById,
  getSalesExeNotSyncList,
  updateSyncSalesExecutive,
  toHeardDeleteSalesExecutive,
  deleteAllSalesExecutive,
};
