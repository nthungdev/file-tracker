// const electron = require("electron");
// const { ipcRenderer } = electron;
let fs = require("fs");

function dirPath() {
  document.getElementById("demo").innerHTML = document.getElementById(
    "inputfile"
  ).files[0].path;
  console.log(document.getElementById("inputfile").files[0].path);
}

function scanDirs() {
  var fs = require("fs");
  path = document.getElementById("demo").innerHTML;
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

function getFileNameAndFilePath(path) {
  let result;
  for (let i = path.length; i > -1; i--) {}
}

/// Return a Stats object of the file
function getFileStats(path) {
  // var path = "C:\\Users\\vuaga\\Desktop\\oshw\\file-tracker";
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
path = "C:\\Users\\vuaga\\Desktop\\file-tracker\\package-lock.json";
// console.log(getFilePathsInDir(path));
console.log(getFileStats(path));
