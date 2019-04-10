// const electron = require("electron");
const { ipcRenderer } = require("electron");

var filePath;

// import { addTableElement } from "./scripts";
let fs = require("fs");

function dirPath() {
  document.getElementById("demo").innerHTML = document.getElementById(
    "inputfile"
  ).files[0].path;

  const { ipcRenderer } = require("electron");
  // DOM SELECTORs
  const backButton = document.querySelector("button.viewSnapshotsButton");
  filePath = document.querySelector("#demo");

  // console.log(filePath.innerHTML);
  ipcRenderer.send("folder-path-middleware", filePath.innerHTML);
}

// ipcRenderer.on("folder-path", (event, arg) => {
//   console.log(arg);
// });

function scanDirs() {
  const fs = require("fs");
  path = document.getElementById("demo").innerHTML;
  console.log(path);
  fs.readdir(path, function(err, items) {
    for (let i = 0; i < items.length; i++) {
      let file = path + "\\" + items[i];
      console.log(getFileCredentials(file));
      addTableElement(getFileCredentials(file));
    }
  });
}

/// Return an array of file path in the directory path
function getFilePathsInDir(path, searchInSubdirectories = false) {
  let filePaths = [];

  files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    let filePath = path + "/" + files[i];

    // console.log(filePath);
    filePaths.push(filePath);

    // console.log(getInSubdirectories);
    // console.log(fs.statSync(filePath).isDirectory());

    if (searchInSubdirectories && fs.statSync(filePath).isDirectory()) {
      // console.log("innerFiles");
      innerFiles = fs.readdirSync(filePath);
      // console.log(innerFiles);

      try {
        for (var j = 0; i < innerFiles.length; j++) {
          let innerFilePath = filePath + "/" + innerFiles[j];
          filePaths.push(innerFilePath);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  console.log(filePaths);
  return filePaths;
}

function getFileStatsInDir(path, searchInSubdirectories = false) {
  let fileStats = [];

  files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    let filePath = path + "/" + files[i];

    // console.log(filePath);
    fileStats.push(getFileStats(filePath));

    // console.log(getInSubdirectories);
    // console.log(fs.statSync(filePath).isDirectory());

    if (searchInSubdirectories && fs.statSync(filePath).isDirectory()) {
      // console.log("innerFiles");
      innerFiles = fs.readdirSync(filePath);
      // console.log(innerFiles);

      try {
        for (var j = 0; i < innerFiles.length; j++) {
          let innerFilePath = filePath + "/" + innerFiles[j];
          fileStats.push(getFileStats(innerFilePath));
          // filePaths.push(getFileStats(filePath));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return fileStats;
}

// Return the name of the file in the given path
function getFileName(path) {
  let result;
  for (let i = path.length; i > -1; i--) {
    if (path[i] === "\\") {
      result = path.slice(i + 1, path.length);
      return result;
    }
  }
  return result;
}

// Return the name of the parent folder of the file in the given path
function getFileParent(path) {
  let result;
  for (let i = path.length; i > -1; i--) {
    if (path[i] === "\\") {
      result = path.slice(0, i);
      return result;
    }
  }
  return result;
}

function getFileNameAndFilePath(path) {
  let result = [];
  for (let i = path.length; i > -1; i--) {
    if (path[i] === "\\") {
      result.push(path.slice(0, i));
      result.push(path.slice(i + 1, path.length));
      return result;
    }
  }
  return result;
}

/// Return a fileStat object of the file
function getFileStats(path) {
  //var path = "C:\\Users\\vuaga\\Desktop\\oshw\\file-tracker";
  return {
    ...fs.statSync(path),
    isDirectory: fs.statSync(path).isDirectory(),
    filePath: path,
    fileName: getFileName(path)
  };
  return fs.statSync(path);
}

function getFilesInDir(path) {
  let fs = require("fs");
  console.log(path);

  fs.readdir(path, function(err, items) {
    for (var i = 0; i < items.length; i++) {
      var file = path + "/" + items[i];

      console.log("Start: " + file);
      fs.stat(file, generate_callback(file));
      fs.stat(file, function(err, stats) {
        if (stats.isDirectory()) {
        }
      });
    }
  });
}

function generate_callback(file) {
  return function(err, stats) {
    console.log(file);
    console.log(stats["size"]);
  };
}

// var db = openDatabase("mydb", "1.0", "my first database", 2 * 1024 * 1024);
// console.log(db);
path = "C:\\Users\\vuaga\\Desktop";
path2 =
  "C:\\Users\\vuaga\\OneDrive - plattsburgh.edu\\PERSONAL\\COLLEGE\\Courses\\CSC433";
// console.log(getFilePathsInDir(path));

console.log(getFileStatsInDir(path2, true));

// console.log(getFileStats(path));
// console.log(getFileNameAndFilePath(path));
// console.log(getFileName(path));
// console.log(getFileParent(path));
// scanDirs();

function getFileCredentials(filename) {
  const stats = fs.statSync(filename);
  return [
    filename,
    stats.size,
    stats.mode,
    stats.uid,
    stats.gid,
    stats.atime,
    stats.mtime,
    stats.ctime,
    stats.birthtime,
    stats.isDirectory()
  ];
}

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

// export {
//   getFileStats,
//   getFileStatsInDir,
//   getFilePathsInDir,
//   scanDirs,
//   dirPath
// };
module.exports = {
  getFileStats,
  getFileStatsInDir,
  getFilePathsInDir,
  scanDirs,
  dirPath
};
