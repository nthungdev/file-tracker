// const electron = require("electron");
const { ipcRenderer } = require("electron");

var filePath;

// import { addTableElement } from "./scripts";
let fs = require("fs");

/**
 * Puts the selected directory in the input field with id demo
 */
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

/**
 *
 * @param {String} path The path of the file
 * @param {boolean} searchInSubdirectories Switch to loop in sub directories as well, defaulted to false
 * @return array of array of filepath
 * Loops through all directories and subdirectories if checked
 * and adds their filepath to the filepaths array
 */
function getFilePathsInDir(path, searchInSubdirectories = false) {
  let filePaths = [];

  files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    let filePath = path + "\\" + files[i];

    filePaths.push(filePath);

    if (searchInSubdirectories && fs.statSync(filePath).isDirectory()) {
      innerFiles = fs.readdirSync(filePath);

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

/**
 *
 * @param {String} path The path of the file
 * @param {boolean} searchInSubdirectories Switch to loop in sub directories as well, defaulted to false
 * @return array of array of file stat
 * Loops through all directories and subdirectories if checked
 * and adds their file metadata to the filestats array
 */
function getFileStatsInDir(path, searchInSubdirectories = false) {
  let fileStats = [];

  files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    let filePath = path + "\\" + files[i];
    fileStats.push(getFileStats(filePath));

    if (searchInSubdirectories && fs.statSync(filePath).isDirectory()) {
      innerFiles = fs.readdirSync(filePath);

      try {
        for (var j = 0; i < innerFiles.length; j++) {
          let innerFilePath = filePath + "\\" + innerFiles[j];
          fileStats.push(getFileStats(innerFilePath));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return fileStats;
}

/**
 *
 * @param {String} path The path of the file
 * @return result the name of the file in the given path
 */
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

/**
 *
 * @param {String} path The path of the file
 * @return a fileStat object of the file using
 */
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

/**
 *
 * @param {String} path The path of the file
 * @return the file metadata in an array format
 */
function getFileCredentials(path) {
  const stats = fs.statSync(path);
  return [
    path,
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

module.exports = {
  getFileStats,
  getFileStatsInDir,
  getFilePathsInDir,
  scanDirs,
  dirPath,
  getFileCredentials
};
