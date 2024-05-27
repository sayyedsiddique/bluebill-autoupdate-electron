const dbmgr = require("./dbManager");
const { getDiscountMappingDetails } = require("./discountMappingManger");
const { getMappedTaxDetails } = require("./mappedTaxManager");
const { getProductImagesByProductId } = require("./productImageManager");
const db = dbmgr.db;

// get all products
const getProductsList = () => {
  const productNewArrWithImg = [];

  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS product (
          productId INTEGER PRIMARY KEY,
          productName TEXT,
          sellingPrice INTEGER,
          unitId INTEGER,
          notes TEXT,
          imageUrl TEXT,
          imageId INTEGER DEFAULT (0),
          image TEXT,
          imagesList TEXT,
          purchasingPrice INTEGER DEFAULT (0),
          maxRetailPrice INTEGER DEFAULT (0),
          categoryId INTEGER DEFAULT (0),
          brandId INTEGER DEFAULT (0),
          barCode TEXT,
          quantity INTEGER DEFAULT (0),
          stockLevelAlert TEXT,
          expiryDate INTEGER,
          lastUpdate INTEGER,
          taxName TEXT,
          discountName TEXT,
          active INTEGER DEFAULT (0),
          addedBy INTEGER,
          currencyId INTEGER DEFAULT (0),
          dateAdded INTEGER,
          inventoryManage TEXT DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          priceIncludeTax TEXT DEFAULT (0),
          slug INTEGER,
          subCategoryId INTEGER DEFAULT (0),
          updatedBy TEXT,
          storeId INTEGER DEFAULT (-1),
          isSync INTEGER DEFAULT (0), 
          unitName TEXT, 
          taxId INTEGER, 
          taxValue TEXT, 
          discountId INTEGER, 
          discountVal TEXT, 
          percent INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const readQuery = db?.prepare(`SELECT * FROM product`);
    const rowList = readQuery?.all();
    if (rowList && rowList.length) {
      for (let i = 0; i < rowList.length; i++) {
        // console.log("rowList[i]... ", rowList[i])
        const singleProdImgData =
          rowList[i] && getProductImagesByProductId(rowList[i]?.productId);
        const prodNewObj = {
          ...rowList[i],
          imageId: singleProdImgData?.imageId ? singleProdImgData?.imageId : "",
          imageUrl: singleProdImgData?.imgPath
            ? singleProdImgData?.imgPath
            : "",
        };
        // console.log("prodNewObj... ", prodNewObj)
        productNewArrWithImg.push(prodNewObj);
      }
    }

    console.log("product... ", rowList);
    console.log("productNewArrWithImg... ", productNewArrWithImg);
    return productNewArrWithImg;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getProductDiscountMapped = (categoryId, isDiscountMapped) => {
  const productNewArrWithImg = [];
  let prodNewObj = {};
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS product (
          productId INTEGER PRIMARY KEY,
          productName TEXT,
          sellingPrice INTEGER,
          unitId INTEGER,
          notes TEXT,
          imageUrl TEXT,
          imageId INTEGER DEFAULT (0),
          image TEXT,
          imagesList TEXT,
          purchasingPrice INTEGER DEFAULT (0),
          maxRetailPrice INTEGER DEFAULT (0),
          categoryId INTEGER DEFAULT (0),
          brandId INTEGER DEFAULT (0),
          barCode TEXT,
          quantity INTEGER DEFAULT (0),
          stockLevelAlert TEXT,
          expiryDate INTEGER,
          lastUpdate INTEGER,
          taxName TEXT,
          discountName TEXT,
          active INTEGER DEFAULT (0),
          addedBy INTEGER,
          currencyId INTEGER DEFAULT (0),
          dateAdded INTEGER,
          inventoryManage TEXT DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          priceIncludeTax TEXT DEFAULT (0),
          slug INTEGER,
          subCategoryId INTEGER DEFAULT (0),
          updatedBy TEXT,
          storeId INTEGER DEFAULT (-1),
          isSync INTEGER DEFAULT (0), 
          unitName TEXT, 
          taxId INTEGER, 
          taxValue TEXT, 
          discountId INTEGER, 
          discountVal TEXT, 
          percent INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const readQuery = db?.prepare(`SELECT * FROM product WHERE categoryId = ?`);
    const rowList = readQuery?.all(categoryId);
    if (rowList && rowList.length) {
      for (let i = 0; i < rowList.length; i++) {
        console.log("rowList... ", rowList?.length);
        const singleProdImgData =
          rowList[i] && getProductImagesByProductId(rowList[i]?.productId);
        console.log("isDiscountMapped... ", isDiscountMapped);

        // Check if product has a discount mapped to it
        const discountMappedProduct = getDiscountMappingDetails(
          rowList[i]?.productId
        );

        // If it is false we want to get that products which doesn't has mapped discount
        if (isDiscountMapped) {
          // Include products with discounts mapped
          if (discountMappedProduct?.productId === rowList[i]?.productId) {
            prodNewObj = {
              ...rowList[i],
              imageId: singleProdImgData?.imageId || "",
              imageUrl: singleProdImgData?.imgPath || "",
            };
            productNewArrWithImg.push(prodNewObj);
          }
        } else {
          // If it is false we want to get that products which doesn't has mapped discount

          console.log(
            "discountMappedProductELSECHALA... ",
            discountMappedProduct
          );
          // Include products without discounts mapped
          if (
            !discountMappedProduct ||
            discountMappedProduct?.productId !== rowList[i]?.productId
          ) {
            prodNewObj = {
              ...rowList[i],
              imageId: singleProdImgData?.imageId || "",
              imageUrl: singleProdImgData?.imgPath || "",
            };
            productNewArrWithImg.push(prodNewObj);
          }
        }

        // console.log("prodNewObj... ", prodNewObj)
      }
    }

    console.log("product... ", rowList);
    console.log("productNewArrWithImg... ", productNewArrWithImg);
    return productNewArrWithImg;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getProductTaxMapped = (categoryId, isTaxMapped) => {
  const productNewArrWithImg = [];
  let prodNewObj = {};
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS product (
          productId INTEGER PRIMARY KEY,
          productName TEXT,
          sellingPrice INTEGER,
          unitId INTEGER,
          notes TEXT,
          imageUrl TEXT,
          imageId INTEGER DEFAULT (0),
          image TEXT,
          imagesList TEXT,
          purchasingPrice INTEGER DEFAULT (0),
          maxRetailPrice INTEGER DEFAULT (0),
          categoryId INTEGER DEFAULT (0),
          brandId INTEGER DEFAULT (0),
          barCode TEXT,
          quantity INTEGER DEFAULT (0),
          stockLevelAlert TEXT,
          expiryDate INTEGER,
          lastUpdate INTEGER,
          taxName TEXT,
          discountName TEXT,
          active INTEGER DEFAULT (0),
          addedBy INTEGER,
          currencyId INTEGER DEFAULT (0),
          dateAdded INTEGER,
          inventoryManage TEXT DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          priceIncludeTax TEXT DEFAULT (0),
          slug INTEGER,
          subCategoryId INTEGER DEFAULT (0),
          updatedBy TEXT,
          storeId INTEGER DEFAULT (-1),
          isSync INTEGER DEFAULT (0), 
          unitName TEXT, 
          taxId INTEGER, 
          taxValue TEXT, 
          discountId INTEGER, 
          discountVal TEXT, 
          percent INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const readQuery = db?.prepare(`SELECT * FROM product WHERE categoryId = ?`);
    const rowList = readQuery?.all(categoryId);
    if (rowList && rowList.length) {
      for (let i = 0; i < rowList.length; i++) {
        console.log("rowList... ", rowList);
        const singleProdImgData =
          rowList[i] && getProductImagesByProductId(rowList[i]?.productId);
        console.log("isTaxMapped... ", isTaxMapped);

        // Check if product has a tax mapped to it
        const taxMappedProduct = getMappedTaxDetails(rowList[i]?.productId);

        // If it is false we want to get that products which doesn't has mapped tax
        if (isTaxMapped) {
          // Include products with discounts mapped
          if (taxMappedProduct?.productId === rowList[i]?.productId) {
            prodNewObj = {
              ...rowList[i],
              imageId: singleProdImgData?.imageId || "",
              imageUrl: singleProdImgData?.imgPath || "",
            };
            productNewArrWithImg.push(prodNewObj);
          }
        } else {
          // If it is false we want to get that products which doesn't has mapped tax
          console.log("TaxMappedProductELSECHALA... ", taxMappedProduct);
          // Include products without tax mapped
          if (
            !taxMappedProduct ||
            taxMappedProduct?.productId !== rowList[i]?.productId
          ) {
            prodNewObj = {
              ...rowList[i],
              imageId: singleProdImgData?.imageId || "",
              imageUrl: singleProdImgData?.imgPath || "",
            };
            productNewArrWithImg.push(prodNewObj);
          }
        }

        // console.log("prodNewObj... ", prodNewObj)
      }
    }

    console.log("product... ", rowList);
    console.log("productNewArrWithImg... ", productNewArrWithImg);
    return productNewArrWithImg;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// insert data into sqlite database
const insertProduct = (productObj) => {
  console.log("productObj... ", productObj);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS product (
          productId INTEGER PRIMARY KEY,
          productName TEXT,
          sellingPrice INTEGER,
          unitId INTEGER,
          notes TEXT,
          imageUrl TEXT,
          imageId INTEGER DEFAULT (0),
          image TEXT,
          imagesList TEXT,
          purchasingPrice INTEGER DEFAULT (0),
          maxRetailPrice INTEGER DEFAULT (0),
          categoryId INTEGER DEFAULT (0),
          brandId INTEGER DEFAULT (0),
          barCode TEXT,
          quantity INTEGER DEFAULT (0),
          stockLevelAlert TEXT,
          expiryDate INTEGER,
          lastUpdate INTEGER,
          taxName TEXT,
          discountName TEXT,
          active INTEGER DEFAULT (0),
          addedBy INTEGER,
          currencyId INTEGER DEFAULT (0),
          dateAdded INTEGER,
          inventoryManage TEXT DEFAULT (0),
          isDeleted INTEGER DEFAULT (0),
          priceIncludeTax TEXT DEFAULT (0),
          slug INTEGER,
          subCategoryId INTEGER DEFAULT (0),
          updatedBy TEXT,
          storeId INTEGER DEFAULT (-1),
          isSync INTEGER DEFAULT (0),
          unitName TEXT, 
          taxId INTEGER, 
          taxValue TEXT, 
          discountId INTEGER, 
          discountVal TEXT, 
          percent INTEGER DEFAULT (0)
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const insertQuery = db.prepare(
      `INSERT INTO product 
        (productId, productName, sellingPrice, unitId, notes, imageUrl, imageId, image, imagesList, purchasingPrice, maxRetailPrice, categoryId, brandId, barCode, quantity, stockLevelAlert, expiryDate, lastUpdate, taxName, discountName, active, currencyId, inventoryManage, isDeleted, priceIncludeTax, slug, subCategoryId, storeId, isSync, unitName, taxId, taxValue, discountId, discountVal, percent) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const {
      productId,
      productName,
      sellingPrice,
      unitId,
      notes,
      imageUrl,
      imageId,
      image,
      imagesList,
      purchasingPrice,
      maxRetailPrice,
      categoryId,
      brandId,
      barCode,
      quantity,
      stockLevelAlert,
      expiryDate,
      lastUpdate,
      taxName,
      discountName,
      active,
      currencyId,
      inventoryManage,
      isDeleted,
      priceIncludeTax,
      slug,
      subCategoryId,
      storeId,
      isSync,
      unitName,
      taxId,
      taxValue,
      discountId,
      discountVal,
      percent,
    } = productObj;

    console.log("insertQuery ", insertQuery);
    let info;
    const transaction = db.transaction(() => {
      info = insertQuery.run(
        productId,
        productName,
        sellingPrice,
        unitId,
        notes,
        imageUrl,
        imageId,
        image,
        imagesList,
        purchasingPrice,
        maxRetailPrice,
        categoryId,
        brandId,
        barCode,
        quantity,
        stockLevelAlert,
        expiryDate,
        lastUpdate,
        taxName,
        discountName,
        active,
        currencyId,
        inventoryManage,
        isDeleted,
        priceIncludeTax,
        slug,
        subCategoryId,
        storeId,
        isSync,
        unitName,
        taxId,
        taxValue,
        discountId,
        discountVal,
        percent
      );
      console.log("info... ", info);
      console.log(
        `Inserted ${info.changes} rows with last ID ${info.lastInsertRowid} into product`
      );
    });
    // const productList = getProductsList()
    // console.log("productListINSERT... ", productList)
    transaction();
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateProduct = (productObj) => {
  console.log("productObj... ", productObj);
  try {
    const updateQueryParts = [];
    const updateParams = [];

    const fieldsToUpdate = [
      "productName",
      "sellingPrice",
      "unitId",
      "notes",
      "imageUrl",
      "imageId",
      "image",
      "imagesList",
      "purchasingPrice",
      "maxRetailPrice",
      "categoryId",
      "brandId",
      "barCode",
      "quantity",
      "stockLevelAlert",
      "expiryDate",
      "lastUpdate",
      "taxName",
      "discountName",
      "active",
      "addedBy",
      "currencyId",
      "inventoryManage",
      "isDeleted",
      "priceIncludeTax",
      "slug",
      "subCategoryId",
      "updatedBy",
      "storeId",
      "isSync",
      "unitName",
      "taxId",
      "taxValue",
      "discountId",
      "discountVal",
      "percent",
      "productId",
    ];

    // Iterate through fields to update and add to query
    fieldsToUpdate.forEach((field) => {
      if (productObj.hasOwnProperty(field)) {
        updateQueryParts.push(`${field} = ?`);
        updateParams.push(productObj[field]);
      }
    });

    console.log("updateQueryParts... ", updateQueryParts?.join(", "));
    console.log("updateParams... ", updateParams);

    // Add productId as the last parameter
    updateParams.push(productObj.productId);

    // Construct the update query
    const updateQuery = `UPDATE product SET ${updateQueryParts.join(
      ", "
    )} WHERE productId = ?`;

    // Prepare and execute the update query
    const stmt = db.prepare(updateQuery);
    const result = stmt.run(...updateParams);

    // const updateQuery = db.prepare(
    //   `UPDATE product SET productName = ? , sellingPrice = ? , unitId = ? , notes = ? , imageUrl = ? , imageId = ? , image = ? , imagesList = ? , purchasingPrice = ? , maxRetailPrice = ? , categoryId = ? , brandId = ? , barCode = ? , quantity = ? , stockLevelAlert = ? , expiryDate = ? , lastUpdate = ? , taxName = ? , discountName = ? , active = ? , addedBy = ? , currencyId = ? , inventoryManage = ? , isDeleted = ? , priceIncludeTax = ? , slug = ? , subCategoryId = ? , updatedBy = ? , storeId = ? , isSync = ? , unitName = ?, taxId = ?, taxValue = ?, discountId = ?, discountVal = ?, percent = ? WHERE productId = ? `
    // );

    // const result = updateQuery.run(
    //   productObj?.productName,
    //   productObj?.sellingPrice,
    //   productObj?.unitId,
    //   productObj?.notes,
    //   productObj?.imageUrl,
    //   productObj?.imageId,
    //   productObj?.image,
    //   productObj?.imagesList,
    //   productObj?.purchasingPrice,
    //   productObj?.maxRetailPrice,
    //   productObj?.categoryId,
    //   productObj?.brandId,
    //   productObj?.barCode,
    //   productObj?.quantity,
    //   productObj?.stockLevelAlert,
    //   productObj?.expiryDate,
    //   productObj?.lastUpdate,
    //   productObj?.taxName,
    //   productObj?.discountName,
    //   productObj?.active,
    //   productObj?.addedBy,
    //   productObj?.currencyId,
    //   productObj?.inventoryManage,
    //   productObj?.isDeleted,
    //   productObj?.priceIncludeTax,
    //   productObj?.slug,
    //   productObj?.subCategoryId,
    //   productObj?.updatedBy,
    //   productObj?.storeId,
    //   productObj?.isSync,
    //   productObj?.unitName,
    //   productObj?.taxId,
    //   productObj?.taxValue,
    //   productObj?.discountId,
    //   productObj?.discountVal,
    //   productObj?.percent,
    //   productObj?.productId
    // );

    if (result.changes === 1) {
      console.log("Product updated successfully!");
    } else {
      console.error("Error updating product. No records were changed.");
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getProductDetailsById = (productId) => {
  console.log("prodId... ", productId);
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM product WHERE productId = ? "
    );
    const productDetails = selectQuery?.get(productId);

    if (productDetails) {
      console.log("Found product:", productDetails);
      const singleProdImgData =
        productDetails &&
        getProductImagesByProductId(productDetails?.productId);
      const prodNewObj = {
        ...productDetails,
        imageId: singleProdImgData?.imageId ? singleProdImgData?.imageId : "",
        imageUrl: singleProdImgData?.imgPath ? singleProdImgData?.imgPath : "",
      };
      console.log("prodNewObj... ", prodNewObj);
      return prodNewObj;
    } else {
      console.log("Product not found");
    }
    // return productDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteProductById = (productId) => {
  console.log("productId...", productId);
  try {
    const query = "DELETE FROM product WHERE productId = ? ";
    const deleteQuery = db.prepare(query);
    const result = deleteQuery?.run(productId);

    if (result.changes === 1) {
      console.log("Product deleted successfully!");
      return result;
    } else {
      console.log("Product not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getProductNotSyncList = (isSyncValue) => {
  try {
    const selectQuery = db.prepare("SELECT * FROM product WHERE isSync = ? ");
    const productNotSyncList = selectQuery?.all(isSyncValue);

    if (productNotSyncList) {
      console.log("Found productNotSyncList:", productNotSyncList);
    } else {
      console.log("productNotSyncList not found");
    }
    return productNotSyncList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateSyncProuduct = (products) => {
  console.log("products... ", products);

  products &&
    products?.map((item) => {
      const productObj = {
        productName: item?.productName,
        sellingPrice: item?.sellingPrice,
        unitId: item?.unitId,
        notes: item?.notes,
        imageUrl: item?.imageUrl,
        imageId: item?.imageId,
        image: item?.image,
        imagesList: item?.imagesList,
        purchasingPrice: item?.purchasingPrice,
        maxRetailPrice: item?.maxRetailPrice,
        categoryId: item?.categoryId,
        brandId: item?.brandId,
        barCode: item?.barCode,
        quantity: item?.quantity,
        stockLevelAlert: item?.stockLevelAlert,
        expiryDate: item?.expiryDate,
        lastUpdate: item?.lastUpdate,
        taxName: item?.taxName,
        discountName: item?.discountName,
        active: item?.active,
        addedBy: item?.addedBy,
        currencyId: item?.currencyId,
        inventoryManage: item?.inventoryManage,
        isDeleted: item?.isDeleted,
        priceIncludeTax: item?.priceIncludeTax,
        slug: item?.slug,
        subCategoryId: item?.subCategoryId,
        updatedBy: item?.updatedBy,
        storeId: item?.storeId,
        isSync: 1,
        productId: item?.productId,
      };

      try {
        // const updateQuery = db.prepare(
        //   `UPDATE product SET productName = ? , sellingPrice = ? , unitId = ? , notes = ? , imageUrl = ? , imageId = ? , image = ? , imagesList = ? , purchasingPrice = ? , maxRetailPrice = ? , categoryId = ? , brandId = ? , barCode = ? , quantity = ? , stockLevelAlert = ? , expiryDate = ? , lastUpdate = ? , taxName = ? , discountName = ? , active = ? , addedBy = ? , currencyId = ? , inventoryManage = ? , isDeleted = ? , priceIncludeTax = ? , slug = ? , subCategoryId = ? , updatedBy = ? , storeId = ? , isSync = ? WHERE productId = ? `
        // );

        const insertQuery = db.prepare(
          `INSERT OR REPLACE INTO product (productId, productName, sellingPrice, unitId, notes, imageUrl, imageId, image, imagesList, purchasingPrice, maxRetailPrice, categoryId, brandId, barCode, quantity, stockLevelAlert, expiryDate, lastUpdate, taxName, discountName, active, currencyId, inventoryManage, isDeleted, priceIncludeTax, slug, subCategoryId, storeId, isSync) VALUES (${productObj?.productId} , '${productObj?.productName}' , ${productObj?.sellingPrice} , ${productObj?.unitId} , '${productObj?.notes}' , '${productObj?.imageUrl}' , ${productObj?.imageId} , '${productObj?.image}' , '${productObj?.imagesList}' , ${productObj?.purchasingPrice} , ${productObj?.maxRetailPrice} , ${productObj?.categoryId} , ${productObj?.brandId} , '${productObj?.barCode}' , ${productObj?.quantity} , '${productObj?.stockLevelAlert}' , ${productObj?.expiryDate} , ${productObj?.lastUpdate} , '${productObj?.taxName}' , '${productObj?.discountName}' , ${productObj?.active} , ${productObj?.currencyId} , '${productObj?.inventoryManage}' , ${productObj?.isDeleted} , '${productObj?.priceIncludeTax}' , ${productObj?.slug} , ${productObj?.subCategoryId} , ${productObj?.storeId} , ${productObj?.isSync})`
        );

        let info;
        const transaction = db.transaction(() => {
          info = insertQuery.run();
          console.log("info... ", info);
          console.log(
            `INSERT OR REPLACE ${info.changes} rows with last ID ${info.lastInsertRowid} into product`
          );

          if (info.changes === 1) {
            console.log("Products INSERT OR REPLACE successfully!");
          } else {
            console.error("Error adding products.");
          }
        });
        // const productList = getProductsList()
        // console.log("productListINSERT... ", productList)
        transaction();
        return info;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  toHardDeleteProduct();
};

const toHardDeleteProduct = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM product WHERE isDeleted = 1");
    const result = deleteQuery?.run(productId);

    if (result.changes === 1) {
      console.log("Product hard deleted successfully!");
    } else {
      console.log("Product not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteAllProduct = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM product");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All products are deleted successfully!");
    } else {
      console.log("product not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getProductsByCategoryId = (categoryId) => {
  try {
    const selectQuery = db.prepare(
      "SELECT * FROM product WHERE categoryId = ? "
    );
    const productList = selectQuery?.all(categoryId);

    if (productList) {
      console.log("Found productList:", productList);
    } else {
      console.log("productList not found");
    }
    return productList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getProductsList,
  insertProduct,
  updateProduct,
  getProductDetailsById,
  deleteProductById,
  getProductNotSyncList,
  updateSyncProuduct,
  toHardDeleteProduct,
  deleteAllProduct,
  getProductDiscountMapped,
  getProductTaxMapped,
  getProductsByCategoryId
};
