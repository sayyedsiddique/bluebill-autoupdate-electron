const path = require("path");
const fetch = require("node-fetch");
const { app, BrowserWindow, ipcMain, dialog, protocol } = require("electron");
const isDev = require("electron-is-dev");
const url = require("url");
const os = require("os");
const { autoUpdater } = require("electron-updater");
const Store = require("electron-store");
const licenseDetailsApi = require("./Database/licenseManager");
const express = require("express");
const log = require("electron-log");

log.transports.file.resolvePathFn = () =>
  path.join("/Users/apple/bluebill-pos-web", "logs/main.log");
// Optional, initialize the logger for any renderer process
log.initialize();
log.log("Application version = " + app.getVersion());
log.info("Log from the main process");

// Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// console.log("HTMLfilePath... ", path.join(__dirname, "index.html"));
// console.log("path.join... ", path.join(__dirname, "gate.html"));

const encryptionKey = "ezygen-electron-key";
let accountId = "e0076663-81d8-4800-80c6-9f41a3364162";
const store = new Store({ encryptionKey: encryptionKey });
let win;
async function validateLicenseKey(key) {
  console.log("validateLicenseKey--- ", key);
  const validation = await fetch(
    `https://api.keygen.sh/v1/accounts/${accountId}/licenses/actions/validate-key`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        meta: { key },
      }),
    }
  );
  const { meta, data, errors } = await validation.json();
  if (errors) {
    return { status: validation.status, errors };
  }

  return {
    status: validation.status,
    meta,
    data,
  };
}

// This will be our "gate", which will only unlock for licensed users.
// Wrap the main application window in a license gate. The main window will
// only be launched when a valid license is provided.
async function gateAppLaunchWithLicense(createWindow) {
  const gateWindow = new BrowserWindow({
    resizable: false,
    frame: false,
    width: 420,
    height: 494,
    webPreferences: {
      preload: path.join(__dirname, "gate.js"),
      devTools: isDev,
    },
  });

  // To load local file we need to give this path.join(__dirname, 'gate.html') file path
  gateWindow.loadFile(path.join(__dirname, "gate.html"));

  if (isDev) {
    gateWindow.webContents.openDevTools({ mode: "detach" });
  }

  ipcMain.on("GATE_SUBMIT", async (_event, value) => {
    console.log("value ", value);
    const key = value?.licenseValue;
    // Validate the license key
    const res = await validateLicenseKey(key);
    console.log("response... ", res);
    // Error handling
    if (res.errors) {
      const [{ code }] = res.errors;
      const choice = await dialog.showMessageBox(gateWindow, {
        type: "error",
        title: "Your license is invalid",
        message:
          "The license key you entered does not exist for this product. Would you like to buy a license?",
        detail: `Error code: ${code ?? res.status}`,
        buttons: ["Continue evaluation", "Try again", "Buy a license"],
      });

      switch (choice.response) {
        case 0:
          // Set to evaluation mode
          store.set("app.mode", "EVALUATION");
          store.delete("license");

          // Close the license gate window
          gateWindow.close();

          // Launch our main app
          appLauncher(key);

          break;
        case 1:
          // noop (dismiss and try again)

          break;
        case 2:
          // TODO(ezekg) Open a link to purchase page
          shell.openExternal("https://keygen.sh/for-electron-apps/");

          break;
      }

      return;
    }

    // Branch on the license's validation code
    const { valid, code } = res.meta;
    console.log("code... ", code);
    switch (code) {
      // License is valid. All is well.
      case "VALID": {
        const license = res.data;
        console.log("license... ", license);

        const payload = {
          licenseName: license.attributes.name,
          key: license.attributes.key,
          expiry: license.attributes.expiry,
          status: license.attributes.status,
          uses: license.attributes.uses,
          suspended: license.attributes.suspended ? 1 : 0,
          maxMachines: license.attributes.maxMachines,
          lastValidated: license.attributes.lastValidated,
          created: license.attributes.created,
          updated: license.attributes.updated,
        };
        console.log("payload... ", payload);
        payload && licenseDetailsApi?.insertLicenseDetails(payload);
        store.set("license.expiry", license.attributes.expiry);
        store.set("license.key", license.attributes.key);
        store.set("license.status", code);

        store.set("app.mode", "LICENSED");

        await dialog.showMessageBox(gateWindow, {
          type: valid ? "info" : "warning",
          title: "Thanks for your business!",
          message: `Your license ID is ${res.data.id.substring(
            0,
            8
          )}. It is ${code.toLowerCase()}.`,
          detail: valid
            ? "Automatic updates are enabled."
            : "Automatic updates are disabled.",
          buttons: ["Continue"],
        });

        // Close the license gate window
        gateWindow.close();

        // Launch our main app
        createWindow(key);

        break;
      }
      // For expired licenses, we still want to allow the app to be used, but automatic
      // updates will not be allowed.
      // case "EXPIRED":

      // All other validation codes, e.g. SUSPENDED, etc. are treated as invalid.
      default: {
        store.set("app.mode", "UNLICENSED");
        store.delete("license");

        await dialog.showMessageBox(gateWindow, {
          type: "error",
          title: "Your license is invalid",
          message: "That license key is no longer valid.",
          detail: `Validation code: ${code}`,
          buttons: ["Exit"],
        });

        app.exit(1);

        break;
      }
    }
  });
}

// Handle sending app version to renderer
ipcMain.on(
  "GET_APP_VERSION",
  (event) => (event.returnValue = app.getVersion())
);

function createWindow(key) {
  console.log("createWindowKEY...", key);
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // nodeIntegration: true,
      contextIsolation: true,
      sandbox: false,
      // devTools: false
    },
  });

  // Set minimum window size
  win.setMinimumSize(700, 650);

  // and load the index.html of the app.
  // win.loadFile(path.join(__dirname, "index.html"));
  // console.log("app.isPackaged... ", app.isPackaged);
  // const appURL = app.isPackaged
  //   ? url.format({
  //       pathname: path.join(__dirname, "index.html"),
  //       protocol: "file:",
  //       slashes: true,
  //     })
  //   : "http://localhost:3000";
  //   win.loadURL(appURL)
  isDev
    ? win.loadURL("http://localhost:3000")
    : win.loadFile(path.join(__dirname, "index.html"));

  ipcMain.on(
    "GET_APP_UPDATE",
    (event) => (event.returnValue = `CheckingForUpdate! ${app.getVersion()}`)
  );
  // Keygen auto update license checking in every 3 hours
  if (!isDev) {
    setInterval(
      autoUpdater.checkForUpdatesAndNotify,
      1000 * 60 * 60 * 3 // 3 hours in ms
    );
  }
  // win.loadURL(
  // 	isDev
  // 	  ? "http://localhost:3000"
  // 	  : `file://${path.join(__dirname, "../build/index.html")}`
  //   );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Register event handlers
  registerAutoUpdaterEvents();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


function registerAutoUpdaterEvents() {
  autoUpdater.on("checking-for-update", (info) => {
    log.info("Checking for update...", info);
  });

  autoUpdater.on("update-available", async (info) => {
    log.info("Update available");
    ipcMain.on(
      "GET_APP_UPDATE",
      (event) =>
        (event.returnValue = `Update Available ${info.version})`)
    );
    try {
      await autoUpdater.downloadUpdate();
      log.info("Update download started");
    } catch (error) {
      log.error("Error during update download:", error);
    }
  });

  autoUpdater.on("update-not-available", () => {
    log.info("No update available");
    ipcMain.on(
      "GET_APP_UPDATE",
      (event) =>
        (event.returnValue = `No Update Available. = ${app.getVersion()}`)
    );
  });

  autoUpdater.on("download-progress", (progressTrack) => {
    log.info("Download progress", progressTrack);
    ipcMain.on(
      "GET_APP_UPDATE",
      (event) => (event.returnValue = progressTrack)
    );
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("Update downloaded", info);
    ipcMain.on(
      "GET_APP_UPDATE",
      (event) => (event.returnValue = `Update Downloaded. = ${app.getVersion()}`)
    );
  });

  autoUpdater.on("error", (error) => {
    log.error("AutoUpdater Error:", error);
    curWindow.showMessage(`Error: ${error}`);
  });
}

// Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
  log.error("Uncaught Exception:", err);
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

