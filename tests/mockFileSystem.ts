import { Volume } from 'memfs';
import { FileSystem } from '../src/core/types';

export const mockFileSystem = (files: { [k: string]: string }): FileSystem => {
  const vol = new Volume();
  vol.fromJSON(files);

  // @ts-ignore
  return vol as FileSystem;
};
