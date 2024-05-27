const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all brands
const getBrands = () => {
  try {
      // Define the SQL command to create the table if it doesn't exist
      const createTableQuery = `
      CREATE TABLE IF NOT EXISTS brand (
        brandId INTEGER PRIMARY KEY,
        brandName TEXT,
        isDeleted INTEGER DEFAULT (0),
        lastUpdate INTEGER,
        storeId INTEGER,
        isSync INTEGER DEFAULT (0)
      )
      `;
      // Execute the SQL command to create the table
      db.exec(createTableQuery);

    const query = "SELECT * FROM brand";
    const readQuery = db.prepare(query);
    const brandList = readQuery?.all();
    console.log("brandList ", brandList);
    return brandList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Add brand in sqlite database
const insertBrand = (brandObj) => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS brand (
      brandId INTEGER PRIMARY KEY,
      brandName TEXT,
      isDeleted INTEGER DEFAULT (0),
      lastUpdate INTEGER,
      storeId INTEGER,
      isSync INTEGER DEFAULT (0)
    )
    `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO brand (brandId , brandName, isDeleted, lastUpdate, storeId, isSync) VALUES (${brandObj?.brandId} , '${brandObj?.brandName}' , ${brandObj?.isDeleted} , ${brandObj?.lastUpdate} , ${brandObj?.storeId} , ${brandObj?.isSync})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery?.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into brand`
      );

      if (result.changes === 1) {
        console.log("brand inserted successfully!");
      } else {
        console.error("Error adding brand.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get brand details
const getBrandDetailsById = (brandId) => {
  try {
    const selectQuery = db.prepare("SELECT * FROM brand WHERE brandId = ?");
    const brandDetails = selectQuery.get(brandId);

    if (brandDetails) {
      console.log("Found brandDetails:", brandDetails);
    } else {
      console.log("brandDetails not found");
    }
    return brandDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get brand isSync 0 value list
const getBrandNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare("SELECT * FROM brand WHERE isSync = ?");
    const brandNotSyncList = selectQuery.all(isSyncValue);

    if (brandNotSyncList) {
      console.log("Found brandNotSyncList:", brandNotSyncList);
    } else {
      console.log("BrandNotSyncList not found");
    }
    return brandNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateBrandById = (brandObj) => {
  try {
    const updateQuery = db.prepare(
      "UPDATE brand SET brandName = ? , isDeleted = ? , lastUpdate = ? , storeId = ? , isSync = ? WHERE brandId = ?"
    );

    const result = updateQuery?.run(
      brandObj?.brandName,
      brandObj?.isDeleted,
      brandObj?.lastUpdate,
      brandObj?.storeId,
      brandObj?.isSync,
      brandObj?.brandId
    );

    if (result.changes === 1) {
      console.log("Brand updated successfully!");
    } else {
      console.error("Error updating brand. No records were changed.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncBrand = (brands) => {
  // console.log("brands... ", brands)

  brands &&
    brands?.map((item) => {
      const brandObj = {
        brandName: item?.brandName,
        isDeleted: item?.isDeleted,
        lastUpdate: item?.lastUpdate,
        storeId: item?.storeId,
        isSync: 1,
        brandId: item?.brandId,
      };
      // console.log("brandObj... ", brandObj)

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO brand (brandId , brandName, isDeleted, lastUpdate, storeId, isSync) VALUES (${brandObj?.brandId} , '${brandObj?.brandName}' , ${brandObj?.isDeleted} , ${brandObj?.lastUpdate} , ${brandObj?.storeId} , ${brandObj?.isSync})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery?.run();
          console.log(
            `INSERT OR REPLACE ${result.changes} rows with last ID ${result.lastInsertRowid} into brand`
          );

          if (result.changes === 1) {
            console.log("brand INSERT INTO successfully!");
          } else {
            console.error("Error adding brand.");
          }
        });
        transaction();
        return result;

        // const result = updateQuery?.run(
        //   brandObj?.brandName,
        //   brandObj?.isDeleted,
        //   brandObj?.lastUpdate,
        //   brandObj?.storeId,
        //   brandObj?.isSync,
        //   brandObj?.brandId
        // );

        // if (result.changes === 1) {
        //   console.log("Brand updated successfully!");
        // } else {
        //   console.error("Error updating brand. No records were changed.");
        // }
        // return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  toHardDeleteBrand();

  // }
};

const toHardDeleteBrand = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM brand WHERE isDeleted = 1");
    const brandDetails = deleteQuery.run();

    if (brandDetails) {
      console.log("Brand deleted successfully!");
    } else {
      console.log("Brand not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete brand by id
const deleteBrandById = (brandId) => {
  try {
    const deleteQuery = db.prepare("DELETE FROM brand WHERE brandId = ?");
    const brandDetails = deleteQuery.run(brandId);

    if (brandDetails) {
      console.log("Brand deleted successfully!");
    } else {
      console.log("Brand not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllBrands = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM brand");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All brands are deleted successfully!");
    } else {
      console.log("brand not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getBrands,
  insertBrand,
  getBrandDetailsById,
  deleteBrandById,
  updateBrandById,
  getBrandNotSyncList,
  updateSyncBrand,
  toHardDeleteBrand,
  deleteAllBrands,
};
