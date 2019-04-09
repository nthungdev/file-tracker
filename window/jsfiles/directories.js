const electron = require("electron");
const { ipcRenderer } = electron;

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

function generate_callback(file) {
  return function(err, stats) {
    console.log(file);
    console.log(stats["size"]);
  };
}
