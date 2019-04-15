const fs = require("fs");
const db = require("../scripts/database");
const dir = require("../scripts/directories");
const { ipcRenderer } = require("electron");

// DOM SELECTORS //////////////////////////////////////////////////////////
const folderPathElement = document.getElementById("demo");

// HANDLERS ///////////////////////////////////////////////////////////////////

/**
 *
 * @param {array} file The file's metadata in an array format.
 * The function adds the contents of the array to the Document Object Model(DOM)
 */
function addTableElement(file) {
  let fileElement = document.createElement("DIV");
  fileElement.className = "file-entries";
  fileElement.innerHTML = `<div class = ${"filepath"}>${
    file[0]
  }</div><div class = ${"perms"}>${(file[2] & 0o777).toString(
    8
  )}</div><div class = ${"mod-date"}>${file[6]}</div><div>${file[1]}</div>`;
  document.getElementById("third-row").appendChild(fileElement);
}

/**
 * This is a void function that call the function scanDir() to
 * search through just the primary files.
 *
 * The function also gives an alert if the directory path is not selected.
 */
function loadMetadata() {
  if (folderPathElement.getAttribute("value") == "Select a directory") {
    showAlert();
  } else {
    clearTable();
    scanDirs();
  }
}

/**
 * This is a void function that call the function scanDir() to
 * search through just the primary and secondary files(subdirectories).
 *
 * The function also gives an alert if the directory path is not selected.
 */
function loadMetadataSub() {
  if (folderPathElement.getAttribute("value") == "Select a directory") {
    showAlert();
  } else {
    clearTable();
    scanDirs(true);
  }
}

/**
 * The function clears all the child nodes from the third-row table.
 * And then adds the table column titles
 */
function clearTable() {
  let parent = document.getElementById("third-row");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  let fileElement = document.createElement("DIV");
  fileElement.className = "file-entries";
  fileElement.innerHTML = `<div class = ${"filepath"}>Filename</div><div class = ${"perms"}>Permissions</div>
  <div class = ${"mod-date"}>Date Modified</div><div>Size(in bytes)</div>`;
  document.getElementById("third-row").appendChild(fileElement);
}

/**
 *
 * @param {boolean} checkSubdirectories The switch for checking the subdirectories or not
 * @see loadMetaDataSub for @see checkSubdirectories true
 * @see loadMetaData for @see checkSubdirectories true
 *
 * Then it uses the fs (file system node module) to fetch the metadata of the
 * files in the Directory and Subdirectories acc to checkSubDirectories
 *
 * Then the function calls @see addTableElement to pass the metadata in an array format
 */
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

/**
 *
 * @event onChange
 *
 * The dirPath is called to set the directory path in any text container when the
 * input of id inputfile is changed.
 *
 * This helps users view the entire filepath
 */
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

/**
 *
 * This function saves the metadata of the files in the directory path set in input
 * of id inputfile.
 * The function saves the file metadata in a database file.
 */
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

/**
 * This function logs the data fetched from the database
 */
function showAllSnapshots() {
  db.getAllSnapshots(rows => {
    console.log(rows);
  });
}

/**
 * Shows an alert box asking the user to specify a directory path
 */
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
  }, 4000);
}
