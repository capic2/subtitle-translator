import { ThreeDots } from 'react-loading-icons';
import { Subtitle } from '@subtitle-translator/shared';

interface Props {
  subtitle: Subtitle;
  isLoading: boolean;
}

const SubtitleText = ({ subtitle, isLoading }: Props) => {
  return (
    <span>
      {subtitle.language ?? 'unknown'}
      {subtitle.name ? ` -  ${subtitle.name}` : null}
      {isLoading && (
        <ThreeDots role="progressbar" stroke="#000000" height={10} width={20} />
      )}
    </span>
  );
};

export default SubtitleText;
