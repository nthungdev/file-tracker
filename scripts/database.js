var sqlite3 = require("sqlite3").verbose();

/**
 * Create a table to store file metadata
 */
const createTable = () => {
  let db = new sqlite3.Database("./database.db");
  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Snapshots (
        fileName string NOT NULL,
        filePath string NOT NULL,
        mode string NOT NULL,
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

/**
 * Insert a row of file stats into the database
 * Use getFileStatsInDir function to get list of FileStats
 * @param {*} fileStats
 * @param {*} callback
 * rows is an array. If the result set is empty, it will be an empty array,
 * otherwise it will have an object for each result row which in turn
 * contains the values of that row, like the Database#get function.
 */
function insertSnapshotWithFileStats(fileStats, callback = () => {}) {
  let db = new sqlite3.Database("database.db");
  let query = "INSERT INTO Snapshots VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  let deleteQuery = "DELETE FROM Snapshots WHERE filePath = ?";
  console.log(1);
  db.serialize(() => {
    console.log(2);
    console.log(fileStats);

    db.run(deleteQuery, fileStats.filePath);

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
    callback();
  });
  db.close();
}

/**
 * Insert a row of file stats into the database
 * @param {String} fileName               Name of the file
 * @param {String} filePath               Path of the file
 * @param {Number} mode                   Permissions of the file
 * @param {Number} uid                    Owning User ID of the file
 * @param {Number} gid                    Owning Group ID of the file
 * @param {Number} size                   Size of the file
 * @param {boolean} isDirectory           Is the file a directory?
 * @param {Number} lastAccess             Last access time of the file
 * @param {Number} lastModified           Last modified time of the file
 * @param {Number} creationDate           The time of creation for the file
 *
 * The function adds the metadata of the file into the database
 */
function insertSnapshot(
  fileName,
  filePath,
  mode,
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
      mode,
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

/**
 * @param {rows => {}} callback
 * Rows is an array. If the result set is empty, it will be an empty array,
 * otherwise it will have an object for each result row which in turn
 * contains the values of that row.
 * @return get all data from the database
 */
function getAllSnapshots(callback = rows => {}) {
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

/**
 * @param {String} path the absolute path of the folder
 * @param {rows => {}} callback
 * Rows is an array. If the result set is empty, it will be an empty array,
 * otherwise it will have an object for each result row which in turn
 * contains the values of that row.
 * @return all data of files and subdirectories in a folder
 */
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

/**
 * @param {String} fileName The name of the file
 * @param {String} filePath The path of the file
 * @param {Object} statsObject The meta data of the file in an object format
 * @return result The array of the file data
 */
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
