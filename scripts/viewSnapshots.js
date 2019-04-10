import db from "../scripts/database";
import dir from "../scripts/directories";

function showStat() {
  let path = "C:Users\\vuagaDesktop\\file-tracker";
  var dir = require("../scripts/directories");

  console.log(dir.getFileStats(path));
}
