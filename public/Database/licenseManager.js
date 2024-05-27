const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getLicenseDetails = () => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS licenseDetails (
          licenseName TEXT,
          key TEXT,
          expiry TEXT,
          status TEXT,
          uses INTEGER,
          suspended INTEGER,
          maxMachines INTEGER,
          lastValidated TEXT,
          created TEXT,
          updated TEXT
        )
        `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    const query = "SELECT * FROM licenseDetails";
    const readQuery = db.prepare(query);
    const licenseDetails = readQuery.all();
    console.log("licenseDetails... ", licenseDetails);
    return licenseDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertLicenseDetails = (licenseDetails) => {
  try {
    // Define the SQL command to create the table if it doesn't exist
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS licenseDetails (
              licenseName TEXT,
              key TEXT,
              expiry TEXT,
              status TEXT,
              uses INTEGER,
              suspended INTEGER,
              maxMachines INTEGER,
              lastValidated TEXT,
              created TEXT,
              updated TEXT
            )
            `;
    // Execute the SQL command to create the table
    db.exec(createTableQuery);

    console.log("licenseDetails... ", licenseDetails);
    const insertQuery = db.prepare(
      "INSERT INTO licenseDetails (licenseName, key, expiry, status, uses, suspended, maxMachines, lastValidated, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    let result;

    const transaction = db.transaction(() => {
      result = insertQuery.run(
        licenseDetails?.licenseName,
        licenseDetails?.key,
        licenseDetails?.expiry,
        licenseDetails?.status,
        licenseDetails?.uses,
        licenseDetails?.suspended,
        licenseDetails?.maxMachines,
        licenseDetails?.lastValidated,
        licenseDetails?.created,
        licenseDetails?.updated
      );

      console.log(
        `Inserted ${result.changes} rows with last ID ${result.lastInsertRowid} into licenseDetails`
      );

      if (result.changes === 1) {
        console.log("LicenseDetails inserted successfully!");
        return result;
      } else {
        console.error("Error adding licenseDetails.");
      }
    });
    transaction();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getLicenseDetails,
  insertLicenseDetails,
};
