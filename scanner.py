import os
import sys


def checkAllFiles(root):
    l = []
    for path, subdirs, files in os.walk(root):
        for name in files:
            l.append(File(os.stat(path)), os.path.join(path, name))
            print(os.stat(path))
    return l


def checkPrimaryFiles(root):
    l = []
    dirs = os.listdir(root)
    for files in dirs:
        l.append(File(os.stat(root + "\\" + files), root + files))
    return l


class File():
    def __init__(self, fileAttr, pathName="Coudln't Find File"):
        self._name = pathName
        self._mod = oct(fileAttr.st_mode)
        self._uid = fileAttr.st_uid
        self._gid = fileAttr.st_gid
        self._size = fileAttr.st_size
        self._lastAccTime = fileAttr.st_atime
        self._lastModTime = fileAttr.st_mtime
        self._createdTime = fileAttr.st_ctime

    def __repr__(self):
        return str([self._name, self._mod])


def main():
    root = input("Enter Absolute File Path: \t")
    l = checkPrimaryFiles(root)
    print(l)


main()
