import { FastifyInstance } from 'fastify';
import * as dree from 'dree';
import { Type } from 'dree';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import {
  getSubtitlesFromAddic7ed,
  getSubtitlesFromDirectory,
  getSubtitlesFromFile,
} from '../../utils/getSubtitles';
import {
  Addic7edSubtitle,
  ExternalSubtitle,
  InternalSubtitle,
  isExternalSubtitle,
  ModifiedDree,
  SubInfo,
  Subtitle
} from '@subtitle-translator/shared';
import download from '../../addic7ed-api/download';
import * as process from 'node:process';
import { langs } from '../../addic7ed-api/helpers';

let children: ModifiedDree<dree.Dree>[];
if (process.env.NODE_ENV === 'production') {
  children = [
    {
      name: 'Séries en cours',
      path: '/data/media/series_en_cours',
      type: dree.Type.DIRECTORY,
      relativePath: '.',
      isSymbolicLink: false,
      uuid: uuidv4(),
    },
    {
      name: 'Films à regarder',
      path: '/data/media/films_a_regarder',
      type: dree.Type.DIRECTORY,
      relativePath: '.',
      isSymbolicLink: false,
      uuid: uuidv4(),
    },
    {
      name: 'Séries VO',
      path: '/data/media/series_vo',
      // path: '/mnt/c/_D',
      type: dree.Type.DIRECTORY,
      relativePath: '.',
      isSymbolicLink: false,
      uuid: uuidv4(),
    },
  ];
} else {
  children = [
    {
      name: 'Environement de développement',
      path: 'data',
      type: dree.Type.DIRECTORY,
      relativePath: '.',
      isSymbolicLink: false,
      uuid: uuidv4(),
    },
  ];
}

export const directoryMap = new Map<string, dree.Dree>();
export const fileMap = new Map<string, dree.Dree>();
export const subtitleMap = new Map<string, Subtitle>();

const fileCallback = function (file: ModifiedDree<dree.Dree>) {
  file.uuid = uuidv4();
  logger.debug(`Add file ${file.name} to map with uuid ${file.uuid}`);
  fileMap.set(file.uuid, file);
};
const directoryCallback = function (directory: ModifiedDree<dree.Dree>) {
  directory.uuid = uuidv4();
  logger.debug(`Add file ${directory.name} to map with uuid ${directory.uuid}`);
  directoryMap.set(directory.uuid, directory);
};

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/files', async () => {
    const tree: dree.Dree = {
      name: 'root',
      path: '/',
      type: dree.Type.DIRECTORY,
      relativePath: '.',
      isSymbolicLink: false,
      children: children.map((item) =>
        dree.scan(
          item.path,
          {
            depth: 0,
            stat: false,
            symbolicLinks: false,
            followLinks: false,
            size: false,
            hash: false,
            showHidden: false,
            emptyDirectory: false,
            descendants: false,
            extensions: ['mkv'],
          },
          fileCallback,
          directoryCallback
        )
      ),
    };

    return tree;
  });

  fastify.get<{ Params: { uuid: string } }>(
    '/api/directories/:uuid/files',
    async (request) => {
      const { uuid } = request.params;

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No file uuid',
        };
      }

      const directory = directoryMap.get(uuid);

      if (!directory) {
        logger.error(`No directory found with ${uuid}`);
        return {
          status: false,
          message: `No directory found with uuid ${uuid}`,
        };
      }

      logger.debug(`Get files from directory ${directory.name}`);

      const tree: dree.Dree = dree.scan(
        directory.path,
        {
          depth: 1,
          stat: false,
          symbolicLinks: false,
          followLinks: false,
          size: false,
          hash: false,
          showHidden: false,
          emptyDirectory: false,
          descendants: false,
          extensions: ['mkv'],
        },
        fileCallback,
        directoryCallback
      );

      return tree;
    }
  );

  fastify.get<{ Params: { uuid: string } }>(
    '/api/files/:uuid/subtitles',
    async (request) => {
      const { uuid } = request.params;

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No file uuid',
        };
      }

      const file = fileMap.get(uuid);

      if (!file) {
        logger.error(`No file found with ${uuid}`);
        return {
          status: false,
          message: `No file found with uuid: ${uuid}`,
        };
      }

      let subtitlesFromDirectory: ExternalSubtitle[] = [],
        subtitlesFromAddic7ed: Addic7edSubtitle[] = [],
        subtitlesFromFile: InternalSubtitle[] = [];
      try {
        subtitlesFromDirectory = getSubtitlesFromDirectory(file);
        logger.debug(
          `subtitlesFromDirectory: ${JSON.stringify(subtitlesFromDirectory)}`
        );
      } catch (error) {
        logger.error(error.message);
      }
      try {
        subtitlesFromAddic7ed = await getSubtitlesFromAddic7ed(file);
        logger.debug(
          `subtitlesFromAddic7ed: ${JSON.stringify(subtitlesFromAddic7ed)}`
        );
      } catch (error) {
        logger.error(error.message);
      }
      try {
        subtitlesFromFile = await getSubtitlesFromFile(file);
        logger.debug(`subtitlesFromFile: ${JSON.stringify(subtitlesFromFile)}`);
      } catch (error) {
        logger.debug(`Error: ${error}`);
      }

      const allSubtitles = [
        ...subtitlesFromDirectory,
        ...subtitlesFromFile,
        ...subtitlesFromAddic7ed,
      ];

      allSubtitles.forEach((subtitle) => {
        subtitleMap.set(subtitle.uuid, subtitle);
      });

      return allSubtitles;
    }
  );

  fastify.post<{ Body: { uuid: string; number: number } }>(
    '/api/subtitles/translate',
    (request, reply) => {
      const { uuid, number } = request.body;

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No file uuid',
        };
      }

      if (!number) {
        logger.error(`No number provided`);
        return {
          status: false,
          message: 'No track number',
        };
      }

      const file = fileMap.get(uuid);

      if (!file) {
        logger.error(`No file found with ${uuid}`);
        return {
          status: false,
          message: `No file found with uuid: ${uuid}`,
        };
      }

      try {
        logger.debug(
          `mkvextract tracks "${file.path}" ${
            Number(number) - 1
          }:"/data/temp/${path.basename(file.path)}.srt"`
        );

        execSync(
          `mkvextract tracks "${file.path}" ${
            Number(number) - 1
          }:"/data/temp/${path.basename(file.path)}.srt"`
        );

        // the *entire* stdout and stderr (buffered)

        //console.log(`stderr: ${stderr}`);
        /* fs.copyFileSync(`/data/temp/${path.basename(filePath)}.srt`,
        `/data/input/${path.basename(filePath)}.srt`) */
        logger.debug(
          `subtrans translate "/data/temp/${path.basename(
            file.path
          )}.srt" --src en --dest fr`
        );

        execSync(
          `subtrans translate "/data/temp/${path.basename(
            file.path
          )}.srt" --src en --dest fr`
        );

        logger.debug(`remove /data/temp/${path.basename(file.path)}.srt`);
        fs.rmSync(`/data/temp/${path.basename(file.path)}.srt`);
        logger.debug(
          `move file to ${path.dirname(file.path)}/${path.basename(
            file.path
          )}.fr.srt`
        );
        fs.copyFileSync(
          `/data/temp/${path.basename(file.path)}.fr.srt`,
          `${path.dirname(file.path)}/${path.basename(file.path)}.fr.srt`
        );
        fs.rmSync(`/data/temp/${path.basename(file.path)}.fr.srt`);

        const dree: ModifiedDree<dree.Dree> = {
          uuid: uuidv4(),
          name: `${path.basename(file.path)}.fr.srt`,
          path: `${path.dirname(file.path)}/${path.basename(file.path)}.fr.srt`,
          type: Type.FILE,
          relativePath: '.',
          isSymbolicLink: false,
        };

        fileMap.set(dree.uuid, dree);

        reply.status(201).send({
          uuid: dree.uuid,
          language: 'fr',
          name: dree.name,
          origin: 'External',
        });
      } catch (error) {
        logger.error(`Error: ${error.message}`);
        return {
          status: false,
          message: error.message,
        };
      }
    }
  );

  fastify.post<{ Body: SubInfo & { uuid: string; language: string } }>(
    '/api/subtitles/download',
    async (request, reply) => {
      const { referer, link, uuid, language } = request.body;

      if (!link) {
        logger.error(`No link provided`);
        return {
          status: false,
          message: 'No link',
        };
      }

      if (!referer) {
        logger.error(`No referer provided`);
        return {
          status: false,
          message: 'No referer',
        };
      }

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No uuid',
        };
      }

      const file = fileMap.get(uuid);

      if (!file) {
        logger.error(`No file found with ${uuid}`);
        return {
          status: false,
          message: `No file found with uuid: ${uuid}`,
        };
      }

      logger.debug(
        `Download file ${file.path}.srt with link ${link} and referer ${referer}`
      );
      const subtitlePath = `${file.path}.${langs[language.toLowerCase()]}.srt`
      await download({ link, referer }, subtitlePath);

      const dree: ModifiedDree<dree.Dree> = {
        uuid: uuidv4(),
        name: `${path.basename(subtitlePath)}`,
        path: subtitlePath,
        type: Type.FILE,
        relativePath: '.',
        isSymbolicLink: false,
      };

      fileMap.set(dree.uuid, dree);

      reply.status(201).send({
        uuid: dree.uuid,
        language,
        name: dree.name,
        origin: 'External',
      });
    }
  );

  fastify.delete<{ Params: { uuid: string } }>(
    '/api/subtitles/:uuid',
    async (request, reply) => {
      const { uuid } = request.params;

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No uuid',
        };
      }

      const subtitle = subtitleMap.get(uuid);

      if (!subtitle || !isExternalSubtitle(subtitle)) {
        logger.error(`No subtitle found with ${uuid}`);
        return {
          status: false,
          message: `No subtitle found with uuid: ${uuid}`,
        };
      }

      try {
        fs.rmSync(subtitle.path);
      } catch (error) {
        logger.error(`Cannot delete subtitle file: ${subtitle.path}`);
        return {
          status: false,
          message: `Cannot delete subtitle file: ${subtitle.path}`,
        };
      }

      reply.status(200).send(`Subtitle ${subtitle.path} deleted`);
    }
  );

  fastify.get('/local/subtitles-addic7ed', async () => {
    const file: dree.Dree = {
      name: 'Séries VO',
      // path: '/data/media/series_vo',
      path: '/mnt/c/_D/Reacher/Reacher.S01E01.Welcome.to.Margrave.1080p.10bit.WEBRip.6CH.x265.HEVC-PSA.mkv',
      type: dree.Type.FILE,
      relativePath: '.',
      isSymbolicLink: false,
    };
    return await getSubtitlesFromAddic7ed(file);
  });

  fastify.get('/local/subtitles-file', async () => {
    const file: dree.Dree = {
      name: 'Reacher.S01E01.Welcome.to.Margrave.1080p.10bit.WEBRip.6CH.x265.HEVC-PSA.mkv',
      // path: '/data/media/series_vo',
      path: '/mnt/c/_D/Reacher/Reacher.S01E01.Welcome.to.Margrave.1080p.10bit.WEBRip.6CH.x265.HEVC-PSA.mkv',
      type: dree.Type.FILE,
      relativePath: '.',
      isSymbolicLink: false,
    };
    return [...(await getSubtitlesFromFile(file))];
  });

  fastify.get('/local/subtitle/download', async () => {
    await download(
      { link: '/original/172709/2', referer: '/show/8778' },
      'temps.srt'
    );
  });
}
