import { expect } from 'chai';
import { describe, it } from 'mocha';
import { listNodeModulesInDir } from '../src/core/index';
import { mockFileSystem } from './mockFileSystem';

describe('listNodeModules', () => {
  it('should list node_modules of depth one', () => {
    const fs = mockFileSystem({
      './demo1/node_modules/demoPackage/package.json': '{ "name": "demoPackage" }',
      './demo2/node_modules/demoPackage/package.json': '{ "name": "demoPackage" }',
      './demo3/node_modules/demoPackage/package.json': '{ "name": "demoPackage" }',
      './demo4/package.json': '{ "name": "demo4" }',
    });
    const dirs = listNodeModulesInDir(fs, '.');
    expect(dirs).to.deep.equal([ 'demo1', 'demo2', 'demo3' ]);
  });

  it('should list node_modules of depth two', () => {
    const fs = mockFileSystem({
      './demo4/package.json': '{ "name": "demo4" }',
      './demo4/demo5/node_modules/demoPackage/package.json': '{ "name": "demoPackage" }',
    });
    const dirs = listNodeModulesInDir(fs, '.');
    expect(dirs).to.deep.equal([ 'demo4/demo5' ]);
  });

  it('should list node_modules of depth one & two in the same tree', () => {
    const fs = mockFileSystem({
      './demo4/node_modules/demoPackage/package.json': '{ "name": "demoPackage" }',
      './demo4/demo5/node_modules/demoPackage/package.json': '{ "name": "demoPackage" }',
    });
    const dirs = listNodeModulesInDir(fs, '.');
    expect(dirs).to.deep.equal([ 'demo4', 'demo4/demo5' ]);
  });
});
