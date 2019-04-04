import sqlite3
import datetime

# GLOBAL
_conn = sqlite3.connect('database.db')
_c = _conn.cursor()


def initDatabase():
    snapshots_table = """
    CREATE TABLE Snapshots (
        address string NOT NULL, 
        createdDate date NOT NULL, 
        fileType string NOT NULL,
        lastModified date,
    )
    """

    try:
        _c.execute(snapshots_table)
        _conn.commit()

    except sqlite3.OperationalError:
        return


def cleanDatabase():
    query = """
    DELETE FROM Snapshots
    """

    _c.execute(query)
    _conn.commit()
    initDatabase()


def getSnapshots():
    query = """
    SELECT * FROM Snapshots
    """

    _c.execute(query)
    return _c.fetchall()


def saveSnapshot(address, createdDate, fileType):
    values = (address, createdDate, fileType, )
    query = """
    INSERT INTO Snapshots VALUES (?, ?, ?)
    """

    _c.execute(query, values)
    _conn.commit()


# def main():
#     cleanDatabase()
#     initDatabase()
#     getSnapshots()
#     saveSnapshot("Users/john/", datetime.datetime.now(), "file")
#     _c.close()


# main()
