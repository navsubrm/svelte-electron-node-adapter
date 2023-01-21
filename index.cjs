const { app, BrowserWindow } = require("electron");
const http = require("http");
const log = require("electron-log");

//Set custom environment variables:
process.env["PORT"] = "3000";
process.env["HOST"] = "localhost";
process.env["ORIGIN"] = `http://${process.env.HOST}:${process.env.PORT}`;

const isDev = !app.isPackaged;
const isMac = process.platform === "darwin" ? true : false;

if (!isDev) {
  const server = import(`./build/index.js`)
    .then((server) => server)
    .catch((err) => log.error(`Server Load Error: ${err}`));
}

let mainWindow;

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: `Svelte Electron | Home`,
    width: 800,
    height: 600,
    resizable: !isDev ? true : false,
    show: true,
    webPreferences: {
      contextIsolation: true,
      devTools: isDev,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  await serveHome(0);
}

app.on("ready", async () => {
  createMainWindow();

  mainWindow.on("close", () => {
    app.quit();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

async function serveHome(attempts) {
  if (attempts >= 10) app.quit();

  http
    .get(`${process.env.ORIGIN}`, (res) => {
      const { statusCode, statusMessage } = res;

      log.info(`HTTP Response: ${statusCode}, ${statusMessage}`);

      if (statusMessage !== "OK") {
        log.error(`Request Failed with status code: ${statusCode}`);

        setTimeout(() => serveHome(attempts + 1), 2000);
        return;
      } else {
        log.info(`Request end, loadURL: /`);
        mainWindow.webContents.loadURL(`${process.env.ORIGIN}/`);
      }
    })
    .on("error", (err) => {
      log.error(`Error received: ${err}`);
      setTimeout(() => serveHome(attempts + 1), 2000);
    });
}
