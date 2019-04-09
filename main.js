const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

// Listen for app to be ready
app.on("ready", function() {
  // Create new window
  mainWindow = new BrowserWindow({ width: 1920, height: 1440 });
  // Load html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "window/mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  //Insert the mainmenu
  Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle Dev Tools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      { role: "reload" }
    ]
  }
];
