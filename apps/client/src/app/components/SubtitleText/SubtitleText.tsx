import { ThreeDots } from 'react-loading-icons';
import {
  isExternalSubtitle,
  Origin,
  Subtitle,
  Subtitles,
} from '@subtitle-translator/shared';
import { CiTrash } from 'react-icons/ci';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppConfigProvider } from '../../providers/AppConfigProvider';

interface Props {
  fileUuid: string;
  subtitle: Subtitle;
  isLoading: boolean;
}

const SubtitleText = ({ fileUuid, subtitle, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const { apiUrl } = useAppConfigProvider();
  const mutationDelete = useMutation({
    mutationFn: (uuid: string) => {
      return axios.delete(`${apiUrl}/api/subtitles/${uuid}`);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ['fetchSubtitles', fileUuid],
        (prevSubtitleMap: Map<Origin, Subtitles> | undefined) => {
          const subtitleMap = new Map(prevSubtitleMap);

          const subtitles = subtitleMap?.get(subtitle.origin);

          subtitleMap?.set(
            subtitle.origin,
            subtitles
              ? subtitles.filter(
                  (subtitleToFilter) => subtitleToFilter.uuid !== subtitle.uuid
                )
              : []
          );

          return subtitleMap;
        }
      );
    },
  });

  return (
    <span>
      {subtitle.language ?? 'unknown'}
      {subtitle.name ? ` -  ${subtitle.name}` : null}
      {isExternalSubtitle(subtitle) ? (
        <button
          aria-label="trash"
          onClick={() => mutationDelete.mutate(subtitle.uuid)}
        >
          <CiTrash />
        </button>
      ) : null}
      {isLoading && (
        <ThreeDots role="progressbar" stroke="#000000" height={10} width={20} />
      )}
    </span>
  );
};

export default SubtitleText;
