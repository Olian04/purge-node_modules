import { join as joinPath } from 'path';
import { sync as rimraf } from 'rimraf';
import { FileSystem } from './types';

export const rmdir = (fs: FileSystem, path: string): boolean => {
  if (logic.not.exists(fs, path) || logic.not.isDirectory(fs, path)) {
    return false;
  }

  try {
    rimraf(path, fs);
    return true;
  } catch (err) {
    return false;
  }
};

export const ls = (fs: FileSystem, path: string): string[] => {
  if (logic.not.exists(fs, path) || logic.not.isDirectory(fs, path)) {
    return [];
  }
  return fs.readdirSync(path);
};

export const lsdir = (fs: FileSystem, path: string): string[] => ls(fs, path)
  .filter((p) => logic.isDirectory(fs, joinPath(path, p)));

const __logic = {
  isDirectory: (fs: FileSystem, path: string): boolean => fs.lstatSync(path).isDirectory(),
  exists: (fs: FileSystem, path: string): boolean => fs.existsSync(path),
};

export const logic = {
  ...__logic,
  not: new Proxy(__logic, {
    get(__, k) {
      return (fs, path) => !__[k](fs, path);
    },
  }),
};
