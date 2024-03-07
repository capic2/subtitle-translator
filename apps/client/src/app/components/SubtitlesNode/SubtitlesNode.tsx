import axios from 'axios';
import { Dree } from 'dree';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ModifiedDree,
  Origin,
  originSchema,
  Subtitle,
  Subtitles,
  subtitlesSchema,
} from '@subtitle-translator/shared';
import SubtitleNode from '../SubtitleNode/SubtitleNode';
import { useCallback } from 'react';

const fetchSubtiles = async (uuid: ModifiedDree<Dree>['uuid']) => {
  const { data } = await axios.get(
    `http://192.168.1.106:3333/api/files/${uuid}/subtitles`
  );

  const parsed = subtitlesSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const subtitlesMap = new Map<Origin, Subtitles>();
  originSchema.options.forEach((origin) => {
    const filtered = parsed.data.filter(
      (subtitle) => subtitle.origin === origin
    );
    if (filtered.length > 0) {
      subtitlesMap.set(origin, filtered);
    }
  });

  return subtitlesMap;
};

interface Props {
  uuid: ModifiedDree<Dree>['uuid'];
}

const SubtitlesNode = ({ uuid }: Props) => {
  const queryClient = useQueryClient();
  const { error, data, isLoading } = useQuery<Map<Origin, Subtitles>>({
    queryKey: ['fetchSubtitles', uuid],
    queryFn: () => fetchSubtiles(uuid),
    refetchOnWindowFocus: false,
  });

  const addSubtitle = useCallback(
    (subtitle: Subtitle) => {
      queryClient.setQueryData(
        ['fetchSubtitles', uuid],
        (prevSubtitleMap: Map<Origin, Subtitles> | undefined) => {
          console.log({subtitle})
          const subtitleMap = new Map(prevSubtitleMap);

          const subtitles = subtitleMap?.get(subtitle.origin);
          subtitleMap?.set(subtitle.origin, [...(subtitles ?? []), subtitle]);

          return subtitleMap;
        }
      );
    },
    [uuid]
  );

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error: {error}</>;
  }

  if (!data) {
    return <>No data</>;
  }

  return (
    <ul>
      {Array.from(data.entries()).map(([origin, subtitles]) => {
        return (
          <li>
            {origin}
            <ul>
              {subtitles.map((subtitle) => (
                <SubtitleNode
                  key={subtitle.uuid}
                  fileUuid={uuid}
                  subtitle={subtitle}
                  addSubtitle={addSubtitle}
                />
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default SubtitlesNode;
