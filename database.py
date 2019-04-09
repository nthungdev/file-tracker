import sqlite3
import datetime
import os
import sys

# GLOBAL
# _conn = sqlite3.connect('database.db')
# _c = _conn.cursor()


class SnapshotDatabase:
    __databaseName = 'database.db'
    __instance = None
    __conn = sqlite3.connect('database.db')
    __c = __conn.cursor()

    @classmethod
    def getInstance(cls):
        if SnapshotDatabase.__instance == None:
            SnapshotDatabase()
        return SnapshotDatabase.__instance

    @classmethod
    def disconnect(cls):
        if SnapshotDatabase.__instance != None:
            SnapshotDatabase.__conn.close()

    def __init__(self):
        """ Virtually private constructor. """
        if SnapshotDatabase.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            SnapshotDatabase.__instance = self
            SnapshotDatabase.__initDatabase()

    @classmethod
    def __initDatabase(cls):
        snapshots_table = """
        CREATE TABLE Snapshots (
            filePath string NOT NULL, 
            creationDate date NOT NULL, 
            fileType string NOT NULL,
            lastModified date NOT NULL,
            PRIMARY KEY (creationDate)
        )
        """

        try:
            SnapshotDatabase.__c.execute(snapshots_table)
            SnapshotDatabase.__conn.commit()

        except sqlite3.OperationalError:
            return

    def cleanDatabase(self):
        query = """
        DELETE FROM Snapshots
        """

        SnapshotDatabase.__c.execute(query)
        SnapshotDatabase.__conn.commit()

    def getSnapshots(self):
        query = """
        SELECT * FROM Snapshots
        """

        SnapshotDatabase.__c.execute(query)
        return SnapshotDatabase.__c.fetchall()

    def getSnapshotsByPath(self, folderPath):
        value = (folderPath + "\%",)
        query = """
        SELECT * FROM Snapshots WHERE filePath LIKE ?
        """

        SnapshotDatabase.__c.execute(query, value)
        return SnapshotDatabase.__c.fetchall()

    def saveSnapshot(self, filePath, creationDate, fileType, lastModified):
        values = (filePath, creationDate, fileType, lastModified)
        query = """
        INSERT INTO Snapshots VALUES (?, ?, ?, ?)
        """

        SnapshotDatabase.__c.execute(query, values)
        SnapshotDatabase.__conn.commit()

    def deleteSnapshot(self, filePath):
        values = (filePath,)
        query = """
        DELETE FROM Snapshots WHERE filePath = ?
        """

        SnapshotDatabase.__c.execute(query, values)
        SnapshotDatabase.__conn.commit()


def main():
    # cleanDatabase()
    # initDatabase()
    # getSnapshots()
    # saveSnapshot("Users/john/", datetime.datetime.now(), "file", "now")
    # saveSnapshot("Clients/john/", datetime.datetime.now(), "file", "now")
    # saveSnapshot("Clients/john/", datetime.datetime.now(), "file", "then")
    # print(getSnapshots())

    # print("test")
    # query = "SELECT * FROM Snapshots WHERE filePath LIKE "
    # print(getSnapshotsOfFolder('Clients'))
    # _c.execute(query)
    # print(_c.fetchall())

    # _c.close()
    # database = SnapshotDatabase.getInstance()
    # database.saveSnapshot(
    #     "C:\\Users\\vuaga\\Desktop\\file-tracker", datetime.datetime.now(), "file", "now")

    # print(database.getSnapshotsOfFolder("C:\\Users\\vuaga"))
    # database.disconnect()
    # cu = database.getInstance()
    # print(database.getSnapshots())
    # database.deleteSnapshot("C:\\Users\\vuaga\\Desktop\\file-tracker")
    # print(database.getSnapshots())
    # print(database.getSnapshots())

    # database.cleanDatabase()

    # print(sys.path)
    # for i in sys.path:
    #     print(i)

    pass


main()
