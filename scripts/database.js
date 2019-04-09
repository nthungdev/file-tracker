var sqlite3 = require("sqlite3").verbose();

const createTable = () => {
  let db = new sqlite3.Database("database.db");
  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Snapshots (
        fileName string NOT NULL,
        filePath string NOT NULL,
        mod string NOT NULL,
        uid string NOT NULL,
        gid string NOT NULL,
        size integer NOT NULL,
        lastAccess real NOT NULL,
        lastModified real NOT NULL,
        creationDate real NOT NULL,
        snapshotDate real NOT NULL,
        PRIMARY KEY (creationDate, filePath)
    )`);
  });
  db.close();
};

const insertSnapshot = (
  fileName,
  filePath,
  mod,
  uid,
  gid,
  size,
  lastAccess,
  lastModified,
  creationDate,
  callback
) => {
  let db = new sqlite3.Database("database.db");
  let query = "INSERT INTO Snapshots VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.serialize(() => {
    db.run(
      query,
      fileName,
      filePath,
      mod,
      uid,
      gid,
      size,
      lastAccess,
      lastModified,
      creationDate,
      Date.now()
    );
    callback();
  });
  db.close();
};

const getAllSnapshot = callback => {
  let db = new sqlite3.Database("database.db");
  let query = "SELECT * FROM Snapshots";
  db.serialize(() => {
    db.all(query, (err, rows) => {
      callback(rows);
    });
  });

  db.close();
};

const getSnapshotInDir = (path, callback) => {
  let db = new sqlite3.Database("database.db");
  let newPath = path + "\\%";
  let query = "SELECT * FROM Snapshots WHERE filePath LIKE ?";
  db.serialize(() => {
    db.all(query, newPath, (err, rows) => {
      callback(rows);
    });
  });

  db.close();
};

const convertToList = (fileName, filePath, statsObject) => {
  result = [
    fileName,
    filePath,
    statsObject.mod,
    statsObject.uid,
    statsObject.gid,
    statsObject.size,
    statsObject.lastAccess,
    statsObject.lastModified,
    statsObject.creationDate,
    statsObject.snapshotDate
  ];
  return result;
};

export {
  convertToList,
  createTable,
  insertSnapshot,
  getAllSnapshot,
  getSnapshotInDir
};
