import * as chalk from 'chalk';
import * as realfs from 'fs';
import * as path from 'path';
import * as prompts from 'prompts';
import { listNodeModulesInDir, purgeNodeModules } from '../core/index';
import { FileSystem } from '../core/types';

const run = async (fs: FileSystem, targetDir: string) => {
  const dirs =  listNodeModulesInDir(fs, targetDir);
  if (dirs.length === 0) {
    console.info('No directories nor subdirectories containing node_modules were found. Aborting.');
    return;
  }

  const { directories }: { directories: string[] } = await prompts([{
    type: 'autocompleteMultiselect',
    name: 'directories',
    message: 'Select directories to purge:',
    choices:  dirs.map((dirName) => ({
      title: dirName,
      value: path.join(targetDir, dirName),
      disable: false,
    })),
    // @ts-ignore
    instructions: false,
    hint: '- Space to select. Return to submit',
  }]);

  if (directories === undefined || directories.length === 0) {
    console.log('No directories selected. Aborting.');
    return;
  }

  directories.forEach((dirPath) => {
    const wasDeleted = purgeNodeModules(fs, dirPath);
    if (wasDeleted) {
      console.log(chalk.greenBright('Purged: ', dirPath));
    } else {
      console.log(chalk.redBright('Failed: ', dirPath));
    }
  });
};

run(realfs, process.argv[2] || '.');
