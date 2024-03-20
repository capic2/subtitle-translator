import { http, HttpResponse } from 'msw';
import {
  ExternalSubtitle,
  ModifiedDree,
  SubInfo,
  Subtitles,
} from '@subtitle-translator/shared';
import * as dree from 'dree';
import { Type } from 'dree';
import { root } from './data/files';
import { internalSubtitles } from './data/internalSubtitles';
import { externalSubtitles } from './data/externalSubtitles';
import { addic7edSubtitles } from './data/addic7edSubtitles';

const fileMap = new Map<
  ModifiedDree<dree.Dree>['uuid'],
  ModifiedDree<dree.Dree>
>();
const directoryMap = new Map<
  ModifiedDree<dree.Dree>['uuid'],
  ModifiedDree<dree.Dree>
>();
const subtitleMap = new Map<ModifiedDree<dree.Dree>['uuid'], Subtitles>();

const initData = () => {
  const extractUuid = (drees: ModifiedDree<dree.Dree>[]) => {
    drees.forEach((dree) => {
      if (dree.type === Type.DIRECTORY) {
        directoryMap.set(dree.uuid, dree);
      } else if (dree.type === Type.FILE) {
        fileMap.set(dree.uuid, dree);
      }

      if (dree.children) {
        extractUuid(dree.children);
      }
    });
  };

  extractUuid([root]);

  const fileUUids = Array.from(fileMap.keys());
  subtitleMap.set(fileUUids.at(0)!, [
    ...internalSubtitles,
    ...externalSubtitles,
    ...addic7edSubtitles,
  ]);
};

initData();

export const handlers = [
  http.get('/api/files', () => {
    return HttpResponse.json<ModifiedDree<dree.Dree>>(root);
  }),
  http.get<{ uuid: string }>('/api/directories/:uuid/files', ({ params }) => {
    const directory = directoryMap.get(params.uuid);
    return HttpResponse.json<ModifiedDree<dree.Dree>>(directory);
    /*return HttpResponse.json<ModifiedDree<dree.Dree>>({
      name: 'The Witcher',
      path: '/data/media/series_vo/The Witcher',
      relativePath: 'The Witcher',
      type: Type.DIRECTORY,
      isSymbolicLink: false,
      sizeInBytes: 54577080564,
      uuid: '1',
      children: [
        {
          name: 'The Witcher (2019) S01E01 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E01 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E01 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1645163850,
          uuid: '10',
        },
        {
          name: 'The Witcher (2019) S01E02 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E02 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E02 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1562139975,
          uuid: '11',
        },
        {
          name: 'The Witcher (2019) S01E03 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E03 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E03 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1262750632,
          uuid: '12',
        },
        {
          name: 'The Witcher (2019) S01E04 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E04 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E04 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1695763478,
          uuid: '13',
        },
        {
          name: 'The Witcher (2019) S01E05 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E05 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E05 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1639925610,
          uuid: '14',
        },
        {
          name: 'The Witcher (2019) S01E06 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E06 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E06 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 2116786773,
          uuid: '15',
        },
        {
          name: 'The Witcher (2019) S01E07 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E07 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E07 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1089637934,
          uuid: '16',
        },
        {
          name: 'The Witcher (2019) S01E08 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S01E08 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S01E08 1080p 10Bit NF WEB-DL x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 1593766853,
          uuid: '17',
        },
        {
          name: 'The Witcher (2019) S02E01 1080p 10bit WEBRip x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S02E01 1080p 10bit WEBRip x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S02E01 1080p 10bit WEBRip x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 787300649,
          uuid: '18',
        },
        {
          name: 'The Witcher (2019) S02E02 1080p 10bit WEBRip x265 HEVC.mkv',
          path: '/data/media/series_vo/The Witcher/The Witcher (2019) S02E02 1080p 10bit WEBRip x265 HEVC.mkv',
          relativePath:
            'The Witcher/The Witcher (2019) S02E02 1080p 10bit WEBRip x265 HEVC.mkv',
          type: Type.FILE,
          isSymbolicLink: false,
          extension: 'mkv',
          sizeInBytes: 871590000,
          uuid: '19',
        },
      ],
    });*/
  }),
  http.get<{ uuid: ModifiedDree<dree.Dree>['uuid'] }>(
    `/api/files/:uuid/subtitles`,
    async ({ params }) => {
      const subtitles = subtitleMap.get(params.uuid);
      return HttpResponse.json<Subtitles>(subtitles ?? []);
    }
  ),
  http.post<never, { uuid: string; number: string }>(
    '/api/subtitles/translate',
    async ({ request }) => {
      const { number } = await request.json();
      const subtitle = internalSubtitles.find(
        (subtitle) => subtitle.number === Number(number)
      );

      const externalSubtitle: ExternalSubtitle = {
        name: subtitle!.name,
        uuid: '1',
        language: 'fr',
        origin: 'External',
      };
      return HttpResponse.json(externalSubtitle, { status: 201 });
    }
  ),
  http.post<
    never,
    {
      uuid: string;
      referer: SubInfo['referer'];
      link: SubInfo['link'];
      language: string;
    }
  >('/api/subtitles/download', async ({ request }) => {
    const { uuid, referer, language } = await request.json();
    const subtitle = subtitleMap.get(uuid)?.find((subtitle) => {
      return (
        subtitle.origin === 'Addic7ed' &&
        subtitle.referer === referer &&
        subtitle.language === language
      );
    });

    const externalSubtitle: ExternalSubtitle = {
      name: subtitle?.name,
      uuid: subtitle?.uuid ?? '',
      language: subtitle?.language,
      origin: 'External',
    };

    return HttpResponse.json(externalSubtitle, { status: 201 });
  }),
];
