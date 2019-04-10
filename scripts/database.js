var sqlite3 = require("sqlite3").verbose();

const createTable = () => {
  let db = new sqlite3.Database("./database.db");
  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Snapshots (
        fileName string NOT NULL,
        filePath string NOT NULL,
        mod string NOT NULL,
        uid string NOT NULL,
        gid string NOT NULL,
        size integer NOT NULL,
        isDirectory boolean NOT NULL,
        atimeMs integer NOT NULL,
        mtimeMs integer NOT NULL,
        birthtimeMs integer NOT NULL,
        snapshotDate integer NOT NULL,
        PRIMARY KEY (birthtimeMs, filePath)
    )`);
  });
  db.close();
};

/// Use getFileStatsInDir() to get list of FileStats
function insertSnapshotWithFileStats(fileStats, callback) {
  let db = new sqlite3.Database("database.db");
  let query = "INSERT INTO Snapshots VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  console.log(1);
  db.serialize(() => {
    console.log(2);
    console.log(fileStats);
    db.run(
      query,
      fileStats.fileName,
      fileStats.filePath,
      fileStats.mode,
      fileStats.uid,
      fileStats.gid,
      fileStats.size,
      fileStats.isDirectory,
      fileStats.atimeMs,
      fileStats.mtimeMs,
      fileStats.birthtimeMs,
      Date.now()
    );
    console.log(3);
    // callback();
  });
  db.close();
}

function insertSnapshot(
  fileName,
  filePath,
  mod,
  uid,
  gid,
  size,
  isDirectory,
  lastAccess,
  lastModified,
  creationDate,
  callback = () => {}
) {
  let db = new sqlite3.Database("database.db");
  let query = "INSERT INTO Snapshots VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.serialize(() => {
    db.run(
      query,
      fileName,
      filePath,
      mod,
      uid,
      gid,
      size,
      isDirectory,
      lastAccess,
      lastModified,
      creationDate,
      Date.now(),
      err => {
        if (err) {
          console.log(err);
        }
        // console.log(callback);
        callback();
      }
    );
  });
  db.close();
}

function getAllSnapshots(callback) {
  let db = new sqlite3.Database("database.db");
  let query = "SELECT * FROM Snapshots";
  db.serialize(() => {
    db.all(query, (err, rows) => {
      if (err) {
        console.log(err);
      }
      callback(rows);
    });
  });

  db.close();
}

const getSnapshotInDir = (path, callback = rows => {}) => {
  let db = new sqlite3.Database("database.db");
  let newPath = path + "%";
  let query = "SELECT * FROM Snapshots WHERE filePath LIKE ?";
  db.serialize(() => {
    db.all(query, newPath, (err, rows) => {
      if (err) {
        console.log(err);
      }
      callback(rows);
    });
  });

  db.close();
};

const convertToList = (fileName, filePath, statsObject) => {
  result = [
    fileName,
    filePath,
    statsObject.mode,
    statsObject.uid,
    statsObject.gid,
    statsObject.size,
    statsObject.isDirectory,
    statsObject.atimeMs,
    statsObject.mtimeMs,
    statsObject.birthtimeMs,
    statsObject.snapshotDate
  ];
  return result;
};

createTable();

// insertSnapshotWithFileStats({
//   fileName: "package-lock.json",
//   filePath: "C:\\Users\\vuaga\\Desktop\\file-tracker\\package-lock.json",
//   mode: 33206,
//   uid: 0,
//   gid: 0,
//   size: 60167,
//   isDirectory: false,
//   atimeMs: Date.now(),
//   mtimeMs: Date.now(),
//   birthtimeMs: Date.now()
// });

// insertSnapshot(
//   "package-lock.json",
//   "C:\\Users\\vuaga\\Desktop\\file-tracker\\package-lock.json",
//   33206,
//   0,
//   0,
//   60167,
//   false,
//   Date.now(),
//   Date.now(),
//   Date.now(),
//   () => {
//     getAllSnapshots(rows => console.log(rows));
//   }
// );

// getAllSnapshots(rows => {
//   console.log(rows);
// });

// export {
//   insertSnapshotWithFileStats,
//   convertToList,
//   createTable,
//   insertSnapshot,
//   getAllSnapshots,
//   getSnapshotInDir
// };

module.exports = {
  insertSnapshotWithFileStats,
  convertToList,
  createTable,
  insertSnapshot,
  getAllSnapshots,
  getSnapshotInDir
};
