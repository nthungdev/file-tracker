const fs = require("fs");
const db = require("../scripts/database");
const dir = require("../scripts/directories");
const { ipcRenderer } = require("electron");

// DOM SELECTORS //////////////////////////////////////////////////////////
const folderPathElement = document.getElementById("demo");

// HANDLERS ///////////////////////////////////////////////////////////////////
function addTableElement(file) {
  let fileElement = document.createElement("DIV");
  fileElement.innerHTML = `<div class = ${"file-entries"}><div class = ${"filepath"}>${
    file[0]
  }</div><div class = ${"perms"}>${(file[2] & 0o777).toString(
    8
  )}</div><div class = ${"mod-date"}>${file[6]}</div><div>${
    file[1]
  }</div></div>`;
  document.getElementById("third-row").appendChild(fileElement);
}

function loadMetadata() {
  if (folderPathElement.getAttribute("value") == "Select a directory") {
    showAlert();
  } else {
    scanDirs();
  }
}

function loadMetadataSub() {
  if (folderPathElement.getAttribute("value") == "Select a directory") {
    showAlert();
  } else {
    scanDirs(true);
  }
}

function scanDirs(checkSubdirectories = false) {
  // TODO clear the list before addTableElement
  path = document.getElementById("demo").getAttribute("value");
  console.log(path);
  fs.readdir(path, function(err, items) {
    for (let i = 0; i < items.length; i++) {
      let file = path + "\\" + items[i];

      let fileCredential = dir.getFileCredentials(file);
      console.log(fileCredential);
      addTableElement(fileCredential);

      if (checkSubdirectories && fileCredential[9]) {
        console.log("got to 2nd loop");
        fs.readdir(fileCredential[0], function(err, items) {
          for (let i = 0; i < items.length; i++) {
            let file = path + "\\" + items[i];
            console.log(dir.getFileCredentials(fileCredential[0]));
            addTableElement(dir.getFileCredentials(fileCredential[0]));
          }
        });
      }
    }
  });
}

function dirPath() {
  //   document.getElementById("demo").innerHTML = document.getElementById(
  //     "inputfile"
  //   ).files[0].path;
  folderPathElement.setAttribute(
    "value",
    document.getElementById("inputfile").files[0].path
  );

  // console.log(filePath.innerHTML);
  ipcRenderer.send(
    "folder-path-middleware",
    folderPathElement.getAttribute("value")
  );
}

function saveSnapshot() {
  let folderPath = folderPathElement.getAttribute("value");

  // console.log(folderPath);
  if (!folderPath) return;

  const fileStats = dir.getFileStatsInDir(folderPath);
  fileStats.forEach(item => {
    // console.log(item);
    db.insertSnapshotWithFileStats(item);
  });
}

function showAllSnapshots() {
  db.getAllSnapshots(rows => {
    console.log(rows);
  });
}

function showAlert() {
  const alertBox = document.querySelector(".viewFolders--alert");
  // alertBox.classList.remove("viewFolders--alert_show");
  alertBox.classList.add("viewFolders--alert_show");

  // After 4 seconds, remove the show class from div
  setTimeout(function() {
    alertBox.className = alertBox.className.replace(
      "viewFolders--alert_show",
      ""
    );
  }, 3000);
}
