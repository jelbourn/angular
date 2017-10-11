/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Filesystem} from '@angular/service-worker/config';

import {sha1Binary} from './sha1';

const fs = require('fs');
const path = require('path');

export class NodeFilesystem implements Filesystem {
  constructor(private base: string) {}

  async list(_path: string): Promise<string[]> {
    const dir = this.canonical(_path);
    const entries = fs.readdirSync(dir).map(
        (entry: string) => ({entry, stats: fs.statSync(path.join(dir, entry))}));
    const files = entries.filter((entry: any) => !entry.stats.isDirectory())
                      .map((entry: any) => path.join(_path, entry.entry));

    return entries.filter((entry: any) => entry.stats.isDirectory())
        .map((entry: any) => path.join(_path, entry.entry))
        .reduce(
            async(list: string[], subdir: string) => (await list).concat(await this.list(subdir)),
            Promise.resolve(files));
  }

  async read(_path: string): Promise<string> {
    const file = this.canonical(_path);
    return fs.readFileSync(file).toString();
  }

  async hash(_path: string): Promise<string> {
    const file = this.canonical(_path);
    const contents: Buffer = fs.readFileSync(file);
    return sha1Binary(contents as any as ArrayBuffer);
  }

  async write(_path: string, contents: string): Promise<void> {
    const file = this.canonical(_path);
    fs.writeFileSync(file, contents);
  }

  private canonical(_path: string): string { return path.join(this.base, _path); }
}
