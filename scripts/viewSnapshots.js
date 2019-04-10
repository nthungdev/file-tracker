const db = require("../scripts/database");
const dir = require("../scripts/directories");

// DOM SELECTORs //////////////////////////////////////////////////////////
const backButton = document.querySelector("div.viewSnapshots--pathBar-back");
const folderPathElement = document.querySelector(
  "p.viewSnapshots--pathBar-container-folder-path"
);

// EVENT LISTENERS ////////////////////////////////////////////////////////
backButton.addEventListener("click", handleBackButton);

// HANDLERS ///////////////////////////////////////////////////////////////
function handleBackButton(e) {
  console.log(dir.getFileStats(path));
}

ipcRenderer.on("folder-path", (event, arg) => {
  console.log("in view snapshot");
  console.log("folder-path response");
  console.log(arg);
  folderPath = arg;
  folderPathElement.innerHTML = folderPath;
  loadSavedSnapshots();
});

// VARIABLES ///////////////////////////////////////////////////////
let folderPath;
let hasSavedSnapshot;

console.log(1);
// db.getAllSnapshots(rows => {
//   console.log("getAllSnapshots");
//   console.log(rows);
// });
// console.log(2);

function init() {
  ipcRenderer.send("get-folder-path");

  console.log("init ");
  console.log("folderPath: " + folderPath);
}

init();

function viewAllSnapshot() {
  db.getAllSnapshots(rows => console.log(rows));
}

function loadSavedSnapshots() {
  console.log("loadSavedSnapshots");
  let ids = ["fileName", "filePath", "size", "mtimeMs", "atimeMs", "mode"];

  if (folderPath) {
    console.log(4);
    console.log("folderPath: " + folderPath);
    // let fileStats = dir.getFileStatsInDir(folderPath);
    db.getSnapshotInDir(folderPath, rows => {
      console.log("rows: " + rows);
      console.log(rows.length === 0 ? "none" : rows);
      if (rows.length === 0) {
        hasSavedSnapshot = false;
      } else {
        // if (fileStats.length !== 0) {
        //   fileStats.forEach(fileStat => {
        //     ids.forEach(id => {
        //       element = document.querySelector(
        //         `#${id} div.viewSnapshots--stats-snapshots-section-column`
        //       );
        //       if (element) {
        //         console.log(element);
        //         element.appendChild(createRowData(fileStat[id]));
        //       }
        //     });
        //   });
        // }
      }
    });
  }
}

function createRowData(data) {
  var node = document.createElement("P");
  node.innerHTML = data;
  return node;
}

loadSavedSnapshots();
