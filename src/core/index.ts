import { join as joinPath} from 'path';
import * as fs_helper from './fs_helpers';
import { FileSystem } from './types';

const dirContainsNodeModules = (fs: FileSystem, path: string) => fs_helper.lsdir(fs, path)
  .find((_p) => _p.endsWith('node_modules'))  !== undefined;

export const purgeNodeModules = (fs: FileSystem, path: string): boolean => {
  if (!path.endsWith('node_modules')) {
    path = joinPath(path, 'node_modules');
  }
  if (fs_helper.logic.not.exists(fs, path) || fs_helper.logic.not.isDirectory(fs, path)) {
    return false;
  }
  return fs_helper.rmdir(fs, path);
};

export const listNodeModulesInDir = (fs: FileSystem, path: string): string[] => fs_helper.lsdir(fs, path)
  .reduce((res, _path) => {
    if (_path === 'node_modules') {
      return res;
    }

    const childPath = joinPath(path, _path);

    if (dirContainsNodeModules(fs, childPath)) {
      res = [...res, childPath];
    }

    return [...res, ...listNodeModulesInDir(fs, childPath)];
  }, []);
