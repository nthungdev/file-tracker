// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
const { ipcMain } = require("electron");
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  setApplicationMenu();

  const mainWindow = createWindow("main", {
<<<<<<< HEAD
    width: 1280,
    height: 720,
    icon: "../app/assets/icon.ico"
=======
    width: 1000,
    height: 600,
    icon: "./app/assets/icon.ico"
>>>>>>> 4d23f26a981935f02b6b7837e91ff280aad0b33d
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  let folderPath;
  ipcMain.on("folder-path-middleware", (event, arg) => {
    console.log("from background.js");
    console.log(arg);
    folderPath = arg;
    event.sender.send("folder-path", folderPath);
  });

  ipcMain.on("get-folder-path", (event, arg) => {
    console.log("from background.js");
    console.log("folderPath: " + folderPath);
    event.sender.send("folder-path", folderPath);
  });

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
