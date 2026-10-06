// const { app, BrowserWindow, Menu, dialog } = require("electron");
// const path = require("path");
// const { exec } = require("child_process");

// // ── Single Instance Lock ──────────────────────────────────────────────────────
// const gotLock = app.requestSingleInstanceLock();

// if (!gotLock) {
//   // Second instance → show warning then exit
//   app.whenReady().then(() => {
//     dialog.showMessageBoxSync({
//       type: "warning",
//       message: "Taikisha Map Editor is already open.",
//       detail: "Please close the existing window before opening a new one.",
//       buttons: ["OK"],
//       defaultId: 0,
//     });
//     app.exit(0);
//   });

// } else {
//   // ── First / Main Instance ─────────────────────────────────────────────────

//   let mainWindow;

//   function createWindow() {
//     const isDev = !app.isPackaged;

//     // BACKEND PATH
//     const backendPath = isDev
//       ? path.join(__dirname, "../backend/start_backend.sh")
//       : path.join(process.resourcesPath, "backend/start_backend.sh");

//     console.log("Backend Path:", backendPath);

//     // START BACKEND
//     exec(`bash "${backendPath}"`, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Backend error:", err);
//         return;
//       }
//       if (stdout) console.log(stdout);
//       if (stderr) console.error(stderr);
//     });

//     // REMOVE MENU
//     Menu.setApplicationMenu(null);

//     // CREATE WINDOW
//     mainWindow = new BrowserWindow({
//       width: 1400,
//       height: 900,
//       minimizable: false,
//       maximizable: false,
//       closable: false,
//       autoHideMenuBar: true,
//       title: "Taikisha Map Editor: v.0.2",
//       webPreferences: {
//         contextIsolation: true,
//         nodeIntegration: false,
//       },
//     });

//     // LOAD FRONTEND
//     mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

//     mainWindow.on("closed", () => {
//       mainWindow = null;
//     });
//   }

//   // Second instance tries to open → focus existing window + show message


//   app.whenReady().then(createWindow);

//   app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//       app.quit();
//     }
//   });
// }





////////////////////////////////  Sending of json and yaml files is implemented in this file //////////////////////////////////////////
////////////////////////////////  change robot username, password and path to store file (optional) //////////////////////////////////////////
////////////////////////////////  No need seperate python files to run on robot //////////////////////////////////////////////////////

const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const { Client } = require("ssh2"); // npm install ssh2

// ── SSH / SFTP: send a file to the robot ─────────────────────────────────────
// Fixed login used for every robot. The user only types the robot IP in the app.
const ROBOT_USER = "taikisha";
const ROBOT_PASSWORD = "12345";
const ROBOT_PORT = 22;
const ROBOT_REMOTE_DIR = "Desktop"; // relative to the robot's home folder, or an absolute path

function sendOverSftp({ host, port = 22, username, password, remoteDir, filename, content }) {
  return new Promise((resolve) => {
    const conn = new Client();
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      try { conn.end(); } catch (_) {}
      resolve(result);
    };

    conn.on("ready", () => {
      conn.sftp((err, sftp) => {
        if (err) return finish({ ok: false, error: `SFTP unavailable: ${err.message}` });

        // Resolve the robot's home directory, so "Desktop" means ~/Desktop.
        sftp.realpath(".", (rpErr, home) => {
          if (rpErr) return finish({ ok: false, error: `Cannot resolve home folder: ${rpErr.message}` });

          const dir = path.posix.isAbsolute(remoteDir) ? remoteDir : path.posix.join(home, remoteDir);
          const remotePath = path.posix.join(dir, filename);

          const write = () =>
            sftp.writeFile(remotePath, Buffer.from(content, "utf8"), (wErr) => {
              if (wErr) return finish({ ok: false, error: `Write failed (${remotePath}): ${wErr.message}` });
              finish({ ok: true, path: remotePath });
            });

          // Create the folder if it doesn't exist yet, then write.
          sftp.stat(dir, (sErr) => {
            if (!sErr) return write();
            sftp.mkdir(dir, (mErr) => {
              if (mErr) return finish({ ok: false, error: `Cannot create ${dir}: ${mErr.message}` });
              write();
            });
          });
        });
      });
    });

    conn.on("error", (e) => {
      let msg = e.message;
      if (e.level === "client-authentication") msg = "Authentication failed. Check username/password.";
      else if (e.code === "ECONNREFUSED") msg = `Connection refused at ${host}:${port}. Is SSH running on the robot?`;
      else if (e.code === "EHOSTUNREACH" || e.code === "ENETUNREACH") msg = `Robot ${host} is unreachable.`;
      else if (e.code === "ETIMEDOUT" || /Timed out/i.test(e.message)) msg = `Connection to ${host}:${port} timed out.`;
      finish({ ok: false, error: msg });
    });

    conn.connect({ host, port, username, password, readyTimeout: 10000 });
  });
}

function registerRobotIpc() {
  ipcMain.handle("robot:send-file", async (_event, opts = {}) => {
    const { host, filename, content } = opts;
    if (!host) return { ok: false, error: "Missing robot IP." };
    if (typeof content !== "string" || !content.length) return { ok: false, error: "Empty file content." };

    // Keep only a safe base filename (no folders).
    const safeName = path.basename(String(filename || "")).replace(/[^A-Za-z0-9._-]+/g, "_");
    if (!safeName) return { ok: false, error: "Invalid filename." };

    return sendOverSftp({
      host: String(host),
      port: ROBOT_PORT,
      username: ROBOT_USER,
      password: ROBOT_PASSWORD,
      remoteDir: ROBOT_REMOTE_DIR,
      filename: safeName,
      content,
    });
  });
}

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
  // ── First / Main Instance ───────────────────────────────────────────────────
  let mainWindow;

  // Register the IPC handler used by "Send to Robot" (once, before the window opens)
  registerRobotIpc();

  function createWindow() {
    const isDev = !app.isPackaged;

    // BACKEND PATH
    // Sending YAML/JSON to the robot no longer needs this backend. Keep this block
    // only if something else in the app still uses it; otherwise you can delete it.
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
        // No preload script: the React app uses window.require("electron").ipcRenderer
        // directly. This is fine because the app only loads its own local files.
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // LOAD FRONTEND
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}