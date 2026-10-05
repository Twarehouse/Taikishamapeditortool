const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const { exec } = require("child_process");

// ── Single Instance Lock ──────────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  // Second instance → show warning then exit
  app.whenReady().then(() => {
    dialog.showMessageBoxSync({
      type: "warning",
      message: "Taikisha Map Editor is already open.",
      detail: "Please close the existing window before opening a new one.",
      buttons: ["OK"],
      defaultId: 0,
    });
    app.exit(0);
  });

} else {
  // ── First / Main Instance ─────────────────────────────────────────────────

  let mainWindow;

  function createWindow() {
    const isDev = !app.isPackaged;

    // BACKEND PATH
    const backendPath = isDev
      ? path.join(__dirname, "../backend/start_backend.sh")
      : path.join(process.resourcesPath, "backend/start_backend.sh");

    console.log("Backend Path:", backendPath);

    // START BACKEND
    exec(`bash "${backendPath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Backend error:", err);
        return;
      }
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    });

    // REMOVE MENU
    Menu.setApplicationMenu(null);

    // CREATE WINDOW
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minimizable: false,
      maximizable: false,
      closable: false,
      autoHideMenuBar: true,
      title: "Taikisha Map Editor: v.0.2",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // LOAD FRONTEND
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }

  // Second instance tries to open → focus existing window + show message


  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}