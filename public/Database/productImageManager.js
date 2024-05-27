const dbmgr = require("./dbManager");
const db = dbmgr.db;
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// get all productImage
const getProductsImagesList = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS productImage (
          imageId INTEGER PRIMARY KEY,
          productId INTEGER,
          storeId INTEGER,
          isProductDefaultImage INTEGER DEFAULT (0),
          userName TEXT,
          isSync INTEGER DEFAULT (0),
          imgPath TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const readQuery = db?.prepare(`SELECT * FROM productImage`);
    const rowList = readQuery?.all();
    console.log("productImage... ", rowList);
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// insert product image
const insertProductsImage = (imgPayload, imgeEvent) => {
  console.log("imgPayload... ", imgPayload.imgPath);
  console.log("imgeEvent... ", imgeEvent);

  // // /Users/apple/bluebill-pos-web/public/Images with ".."
  // // /Users/apple/bluebill-pos-web/src/assets/images "../.."
  const projectFolderPath = path.join(__dirname, "..", "Images");
  console.log("projectFolderPath... ", projectFolderPath);

  // // Ensure the project folder exists
  if (!fs.existsSync(projectFolderPath)) {
    fs.mkdirSync(projectFolderPath, { recursive: true });
  }

  // const imageData = imgObj.filePreview; // Assuming file.preview contains the Data URL
  // const imageName = imgObj?.fileData?.name && imgObj?.fileData?.name;
  // const imageName = imgeEvent.target.files[0] && imgeEvent.target.files[0].name;
  const imageName = imgeEvent && imgeEvent.name;

  // // /Users/apple/bluebill-pos-web/public/Images/imagename
  const imagePath = imageName && path.join(projectFolderPath, imageName);
  console.log("imagePath... ", imagePath);

  // // Extract the base64-encoded data from the Data URL
  const base64Data =
    imgPayload.imgPath && fs.readFileSync(imgPayload.imgPath, "base64");
  // console.log("base64Data... ", base64Data)

  //  // Convert the base64 data to a Buffer
  const bufferData = base64Data && Buffer.from(base64Data, "base64");
  // console.log("bufferData... ", bufferData);

  // // Write the Data URL directly to the file
  imagePath && fs.writeFileSync(imagePath, bufferData);

  // here we calling sqlite insert api
  if (imgPayload.imgPath) {
    try {
      // Define the SQL command to create the table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS productImage (
          imageId INTEGER PRIMARY KEY,
          productId INTEGER,
          storeId INTEGER,
          isProductDefaultImage INTEGER DEFAULT (0),
          userName TEXT,
          isSync INTEGER DEFAULT (0),
          imgPath TEXT
        )
        `;
      // Execute the SQL command to create the table
      db.exec(createTableQuery);

      const insertQuery = db.prepare(
        `INSERT INTO productImage (imageId, productId, storeId, isProductDefaultImage, userName, isSync, imgPath) VALUES (${
          imgPayload?.imageId
        }, ${imgPayload?.productId}, ${imgPayload?.storeId}, ${
          imgPayload?.isProductDefaultImage
        }, '${imgPayload?.userName}', ${imgPayload?.isSync}, '/${
          imagePath?.split("/public/")[1]
        }')`
      );
      console.log("insertQuery ", insertQuery);
      let info;
      const transaction = db.transaction(() => {
        info = insertQuery.run();
        console.log("info... ", info);
        console.log(
          `Inserted ${info.changes} rows with last ID ${info.lastInsertRowid} into productImage`
        );
      });
      transaction();
      return info;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};

// get all product images by product id
const getProductImagesByProductId = (productId) => {
  console.log("productId... ", productId);
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
          CREATE TABLE IF NOT EXISTS productImage (
            imageId INTEGER PRIMARY KEY,
            productId INTEGER,
            storeId INTEGER,
            isProductDefaultImage INTEGER DEFAULT (0),
            userName TEXT,
            isSync INTEGER DEFAULT (0),
            imgPath TEXT
          )
          `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const selectQuery = db?.prepare(
      `SELECT * FROM productImage WHERE productId = ?`
    );
    const selectedProductImages = selectQuery?.get(productId);
    console.log("selectedProductImages... ", selectedProductImages);
    return selectedProductImages;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteProductImagesByProductId = (productId) => {
  console.log("deleteProductImagesByProductId... ", productId);
  try {
    const deleteQuery = db.prepare(
      "DELETE FROM productImage WHERE productId = ? "
    );
    const result = deleteQuery?.run(productId);

    if (result.changes === 1) {
      console.log("Product image deleted successfully!");
    } else {
      console.log("Product image not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateProductImagesByProductId = (productImagePayload) => {
  console.log("ProductImagesByProductId... ", productImagePayload);
  if (productImagePayload.imgPath) {
    try {
      const deleteQuery = db.prepare(
        "UPDATE productImage SET imageId = ?, imgPath = ?, storeId = ?, isProductDefaultImage = ?, userName = ?, isSync = ? WHERE productId = ? "
      );
      const result = deleteQuery?.run(
        productImagePayload?.imageId,
        productImagePayload?.imgPath,
        productImagePayload?.storeId,
        productImagePayload?.isProductDefaultImage,
        productImagePayload?.userName,
        productImagePayload?.isSync,
        productImagePayload?.productId
      );

      if (result.changes === 1) {
        console.log("Product image updated successfully!");
      } else {
        console.log("Product image not founded.");
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

const deleteAllProductImages = () => {
  try {
    const deleteQuery = db.prepare("DELETE FROM productImage");
    const result = deleteQuery.run();
    if (result.changes === 1) {
      console.log("All productImages are deleted successfully!");
    } else {
      console.log("productImage not founded.");
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getProductsImagesList,
  insertProductsImage,
  getProductImagesByProductId,
  deleteProductImagesByProductId,
  updateProductImagesByProductId,
  deleteAllProductImages,
};
