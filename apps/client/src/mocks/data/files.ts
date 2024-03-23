import type { ModifiedDree } from '@subtitle-translator/shared';
import * as dree from 'dree'
import { Type } from 'dree';

export const root: ModifiedDree<dree.Dree> =  {
  name: 'root',
  path: '/',
  type: Type.DIRECTORY,
  relativePath: '.',
  isSymbolicLink: false,
  uuid: 'd0',
  children: [
    {
      name: 'directory_d0d1',
      path: '/directoryd_0d1',
      relativePath: '.',
      type: Type.DIRECTORY,
      isSymbolicLink: false,
      sizeInBytes: 383100360543,
      uuid: 'd0d1',
    },
    {
      name: 'directory_d0d2',
      path: '/directory_d0d2',
      relativePath: '.',
      type: Type.DIRECTORY,
      isSymbolicLink: false,
      sizeInBytes: 383100360543,
      uuid: 'd0d2',
      children: [
        {
          name: 'directory_d0d2d1',
          path: '/directory_d0d2/directory_d0d2d1',
          relativePath: '.',
          type: Type.DIRECTORY,
          isSymbolicLink: false,
          sizeInBytes: 383100360543,
          uuid: 'd0d2d1',
        },
        {
          name: 'file_d0d2d1f1.mkv',
          path: '/directory_d0d2/file_d0d2d1f1.mkv',
          relativePath: 'file_d0d2d1f1.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 267802658,
          uuid: 'd0d2d1f1',
        },
        {
          name: 'file_d0d2d1f2.mkv',
          path: '/directory_d0d2/file_d0d2d1f2.mkv',
          relativePath: 'file_d0d2d1f2.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 267802658,
          uuid: 'd0d2d1f2',
        },
        {
          name: 'file_d0d2d1f3.mkv',
          path: '/directory_d0d2/file_d0d2d1f3.mkv',
          relativePath: 'file_d0d2d1f3.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 267802658,
          uuid: 'd0d2d1f3',
        },
      ]
    },
    {
      name: 'file_d0f1.mkv',
      path: 'file_d0f1.mkv',
      relativePath: 'file_d0f1.mkv',
      type: Type.FILE,
      isSymbolicLink: false,
      extension: 'mkv',
      sizeInBytes: 267802658,
      uuid: 'd0f1',
    },
    {
      name: 'file_d0f2',
      path: '/file_d0f2.mkv',
      relativePath: 'file_d0f2.mkv',
      type: Type.FILE,
      isSymbolicLink: false,
      extension: 'mkv',
      sizeInBytes: 308738316,
      uuid: 'd0f2',
    },
  ],
}


