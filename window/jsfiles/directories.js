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
          secondary_path = file + "/";
          fs.readdir(secondary_path, function(secondary_err, secondary_items) {
            for (var j = 0; j < secondary_items.length; j++) {
              var secondary_file = secondary_path + "/" + secondary_items[j];
              console.log("Secondary: " + secondary_file);
              fs.stat(secondary_file, generate_callback(secondary_file));
            }
          });
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
