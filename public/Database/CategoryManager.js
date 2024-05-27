const dbmgr = require("./dbManager");
const db = dbmgr.db;

// get all categories
const getAllCategories = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS category (
          categoryId INTEGER PRIMARY KEY,
          categoryName TEXT,
          isDeleted INTEGER DEFAULT (0),
          lastUpdate INTEGER,
          storeId INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM category";
    const readyQuery = db?.prepare(query);
    const categoryList = readyQuery?.all();
    console.log("categoryList ", categoryList);
    return categoryList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// insert category into sqlite database
const insertCategory = (categoryObj) => {
  console.log("insertCategoryObj... ", categoryObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS category (
          categoryId INTEGER PRIMARY KEY,
          categoryName TEXT,
          isDeleted INTEGER DEFAULT (0),
          lastUpdate INTEGER,
          storeId INTEGER DEFAULT (0),
          isSync INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO category (categoryId , categoryName , isDeleted , lastUpdate , storeId , isSync) VALUES (${categoryObj?.categoryId} , '${categoryObj?.categoryName}' , ${categoryObj?.isDeleted} , ${categoryObj?.lastUpdate} , ${categoryObj?.storeId} , ${categoryObj?.isSync})`
    );
    let result;
    const transaction = db.transaction(() => {
      result = insertQuery.run();
      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into category`
      );

      if (result.changes === 1) {
        console.log("Category inserted successfully!");
      } else {
        console.error("Error adding category.");
      }
    });
    transaction();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update category in sqlite datebase by category id
const updateCategoryById = (categoryObj) => {
  console.log("updatecategoryObj... ", categoryObj);
  try {
    const updateQuery = db.prepare(
      `UPDATE category SET categoryName = ? , isDeleted = ? , lastUpdate = ? , storeId = ? , isSync = ? WHERE categoryId = ? `
    );
    const result = updateQuery.run(
      categoryObj?.categoryName,
      categoryObj?.isDeleted,
      categoryObj?.lastUpdate,
      categoryObj?.storeId,
      categoryObj?.isSync,
      categoryObj?.categoryId
    );
    console.log(
      `Updated ${result.changes} rows with last ID ${result.lastInsertRowid} into category`
    );

    if (result.changes === 1) {
      console.log("Category updated successfully!");
      return result;
    } else {
      console.error("Error update category.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get category details by id
const getCategoryDetailsById = (categoryId) => {
  try {
    const query = db.prepare("SELECT * FROM category WHERE categoryId = ?");
    const selectedCategory = query?.get(categoryId);
    if (selectedCategory) {
      console.log("Found selectedCategory:", selectedCategory);
    } else {
      console.log("selectedCategory not found");
    }
    return selectedCategory;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete category by id from sqlite database
const deleteCategoryById = (categoryId) => {
  try {
    const query = "DELETE FROM category WHERE categoryId = ?";
    const readQuery = db.prepare(query);
    const deletedQuery = readQuery?.run(categoryId);
    if (deletedQuery) {
      console.log("Category deleted successfully!");
    } else {
      console.log("Category not found");
    }
    return deletedQuery;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get category not sync list
const getCategoryNotSyncList = (isSyncValue) => {
  try {
    const query = db.prepare("SELECT * FROM category WHERE isSync = ?");
    const CategoryNotSyncList = query?.all(isSyncValue);
    if (CategoryNotSyncList) {
      console.log("Found CategoryNotSyncList:", CategoryNotSyncList);
    } else {
      console.log("CategoryNotSyncList not found");
    }
    return CategoryNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncCategory = (categories) => {
  console.log("categories... ", categories);

  categories &&
    categories?.map((item) => {
      const categoryObj = {
        categoryName: item?.categoryName,
        isDeleted: item?.isDeleted,
        lastUpdate: item?.lastUpdate,
        storeId: item?.storeId,
        isSync: 1,
        categoryId: item?.categoryId,
      };
      console.log("categoryObj... ", categoryObj);

      try {
        const updateQuery = db.prepare(
          `INSERT OR REPLACE INTO category (categoryId , categoryName , isDeleted , lastUpdate , storeId , isSync) VALUES (${categoryObj?.categoryId} , '${categoryObj?.categoryName}' , ${categoryObj?.isDeleted} , ${categoryObj?.lastUpdate} , ${categoryObj?.storeId} , ${categoryObj?.isSync})`
        );

        let result;
        const transaction = db.transaction(() => {
          result = updateQuery.run();
          console.log(
            `INSERT OR REPLACE INTO ${result.changes} rows with last ID ${result.lastInsertRowid} into category`
          );

          if (result.changes === 1) {
            console.log("Category INSERT INTO successfully!");
          } else {
            console.error("Error adding category.");
          }
        });
        transaction();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  toHardDeleteCategory();
};

// delete category by id from sqlite database
const toHardDeleteCategory = () => {
  try {
    const query = "DELETE FROM category WHERE isDeleted = 1";
    const readQuery = db.prepare(query);
    const deletedQuery = readQuery?.run();
    if (deletedQuery) {
      console.log("Category hard deleted successfully!");
    } else {
      console.log("Category not found");
    }
    return deletedQuery;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllCategory = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM category");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All categorys are deleted successfully!");
    } else {
      console.log("category not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllCategories,
  insertCategory,
  updateCategoryById,
  getCategoryDetailsById,
  deleteCategoryById,
  getCategoryNotSyncList,
  updateSyncCategory,
  toHardDeleteCategory,
  deleteAllCategory,
};
