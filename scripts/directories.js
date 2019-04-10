// const electron = require("electron");
// const { ipcRenderer } = electron;
let fs = require("fs");

function dirPath() {
  document.getElementById("demo").innerHTML = document.getElementById(
    "inputfile"
  ).files[0].path;
}

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
function getFilePathsInDir(path) {
  let dirs = [];
  let fs = require("fs");

  files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    let file = path + "/" + files[i];

    console.log(file);
    dirs.push(file);
  }

  console.log(dirs);
  return dirs;
}

/// Return a Stats object of the file
function getFileStats(path) {
  //var path = "C:\\Users\\vuaga\\Desktop\\oshw\\file-tracker";
  return fs.lstatSync(path);
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
path = "C:\\Users\\vuaga\\Desktop\\file-tracker";
console.log(getFileStats(path));

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
    file[3]
  }</div></div>`;
  document.getElementById("third-row").appendChild(fileElement);
}
