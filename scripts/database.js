var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");

// db.serialize(function() {
//   db.run(`
//   CREATE TABLE Snapshots (
//     fileName string NOT NULL,
//     filePath string NOT NULL,
//     mod string NOT NULL,
//     uid string NOT NULL,
//     gid string NOT NULL,
//     size integer NOT NULL,
//     lastAccess real NOT NULL,
//     lastModified real NOT NULL,
//     creationDate real NOT NULL,
//     snapshotDate real NOT NULL,
//     PRIMARY KEY (creationDate, fileName)
// )`);

//   var stmt = db.prepare(
//     "INSERT INTO Snapshots VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
//   );
//   for (var i = 0; i < 1; i++) {
//     stmt.run(
//       "scripts",
//       "C:\\Users\\vuaga\\Desktop\\file-tracker\\scripts",
//       "0o40777",
//       0,
//       0,
//       4096,
//       1554781028.6311944,
//       1554781028.6311944,
//       1554773175.0183158,
//       1554781030
//     );
//   }
//   stmt.finalize();

db.each("SELECT * FROM Snapshots", function(err, row) {
  console.log(row.id + ": " + row.info);
});
// });

db.close();
