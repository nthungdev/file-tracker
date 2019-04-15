const db = require("../scripts/database");
const dir = require("../scripts/directories");

// DOM SELECTORs //////////////////////////////////////////////////////////
// const backButton = document.querySelector("div.viewSnapshots--pathBar-back");
const folderPathElement = document.querySelector(
  "p.viewSnapshots--pathBar-container-folder-path"
);

// EVENT LISTENERS ////////////////////////////////////////////////////////
/**
 * @listens click on the back button
 */
// backButton.addEventListener("click", handleBackButton);

// HANDLERS ///////////////////////////////////////////////////////////////

// function handleBackButton(e) {
//   console.log(e);
//   console.log(dir.getFileStats(path));
// }

/**
 * @callback @see loadCurrentMetaData
 */
ipcRenderer.on("folder-path", (event, arg) => {
  console.log("in view snapshot");
  console.log("folder-path response");
  console.log(arg);
  folderPath = arg;
  folderPathElement.innerHTML = folderPath;
  loadSavedSnapshots(loadCurrentMetadata);
});

// VARIABLES ///////////////////////////////////////////////////////
let folderPath;
let hasSavedSnapshot;
let savedFileStats;

function init() {
  ipcRenderer.send("get-folder-path");
}

// function viewAllSnapshot() {
//   db.getAllSnapshots(rows => console.log(rows));
// }

/**
 * Loads the previously saved meta data of the primary files
 * The files are aligned with the current meta data according to rows
 */
function loadSavedSnapshots(calback = () => {}) {
  console.log("loadSavedSnapshots");
  let ids = ["fileName", "filePath", "size", "mtimeMs", "atimeMs", "mode"];

  if (folderPath) {
    console.log(4);
    console.log("folderPath: " + folderPath);
    // let fileStats = dir.getFileStatsInDir(folderPath);
    db.getSnapshotInDir(folderPath, rows => {
      savedFileStats = rows;
      // Sort by file
      savedFileStats.sort((a, b) => {
        if (a.birthtimeMs < b.birthtimeMs) {
          return -1;
        }
        if (a.birthtimeMs > b.birthtimeMs) {
          return 1;
        }
        return 0;
      });
      console.log("savedFileStats: ");
      console.log(savedFileStats);
      // console.log(rows.length === 0 ? "none" : rows);
      if (savedFileStats.length === 0) {
        hasSavedSnapshot = false;
      } else {
        savedFileStats.forEach(savedFileStats => {
          ids.forEach(id => {
            element = document.querySelector(
              `#${id} div.viewSnapshots--stats-snapshots-section-column`
            );
            if (element) {
              // console.log(element);
              if (id.includes("timeMs")) {
                element.appendChild(
                  createRowData(new Date(savedFileStats[id]))
                );
              } else if (id === "mode") {
                // not sure if it need conversion or not. but the line below doesn't work
                // element.appendChild(createRowData(row[id].toString(radix)));
                element.appendChild(
                  createRowData((savedFileStats[id] & 0o777).toString(8))
                );
              } else {
                element.appendChild(createRowData(savedFileStats[id]));
              }
            }
          });
        });
      }
      calback();
    });
  }
}

/**
 * Loads the current meta data of the primary files
 * The old files are loaded first
 * and the new files are shown at the end
 */
function loadCurrentMetadata() {
  console.log("loadCurrentMedata");
  let ids = ["fileName", "filePath", "size", "mtimeMs", "atimeMs", "mode"];

  // console.log("savedFileStats");
  // console.log(savedFileStats);
  if (folderPath) {
    // console.log(4);
    // console.log("folderPath: " + folderPath);
    let filePaths = dir.getFilePathsInDir(folderPath);
    let currentFileStats = dir.getFileStatsInDir(folderPath);
    currentFileStats.sort((a, b) => {
      if (a.birthtimeMs < b.birthtimeMs) {
        return -1;
      }
      if (a.birthtimeMs > b.birthtimeMs) {
        return 1;
      }
      return 0;
    });
    // console.log("123");
    // console.log(filePaths);

    let trackedFiles = [];
    let unTrackedFiles = [];

    currentFileStats.forEach(fileStat => {
      let didSaved = savedFileStats.filter(
        stat => stat.filePath === fileStat.filePath
      );
      console.log("didSaved");
      console.log(didSaved);
      if (didSaved.length !== 0) {
        trackedFiles.push(fileStat);
      } else {
        unTrackedFiles.push(fileStat);
      }
    });

    console.log("trackedFiles");
    console.log(trackedFiles);
    console.log("unTrackedFiles");
    console.log(unTrackedFiles);

    trackedFiles.forEach(row => {
      ids.forEach(id => {
        element = document.querySelector(
          `div.viewSnapshots--stats-currentStats #${id} div.viewSnapshots--stats-snapshots-section-column`
        );
        if (element) {
          // console.log(element);
          if (id.includes("timeMs")) {
            element.appendChild(createRowData(new Date(row[id])));
          } else if (id === "mode") {
            // not sure if it need conversion or not. but the line below doesn't work
            // element.appendChild(createRowData(row[id].toString(radix)));
            element.appendChild(createRowData((row[id] & 0o777).toString(8)));
          } else {
            element.appendChild(createRowData(row[id]));
          }
        }
      });
    });

    unTrackedFiles.forEach(row => {
      ids.forEach(id => {
        element = document.querySelector(
          `div.viewSnapshots--stats-currentStats #${id} div.viewSnapshots--stats-snapshots-section-column`
        );
        if (element) {
          // console.log(element);
          if (id.includes("timeMs")) {
            element.appendChild(createRowData(new Date(row[id])));
          } else if (id === "mode") {
            // not sure if it need conversion or not. but the line below doesn't work
            // element.appendChild(createRowData(row[id].toString(radix)));
            element.appendChild(createRowData((row[id] & 0o777).toString(8)));
          } else {
            element.appendChild(createRowData(row[id]));
          }
        }
      });
    });
  }
}

/**
 *
 * @param {any} data Data to be added specifically to the snapshot tables in the DOM
 */
function createRowData(data) {
  var node = document.createElement("P");
  node.innerHTML = data;
  return node;
}

// function showAllSnapshots() {
//   db.getAllSnapshots(rows => {
//     console.log(rows);
//   });
// }

init();
