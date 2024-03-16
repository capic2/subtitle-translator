import { Dree } from 'dree';
import React, { useState } from 'react';
import { FcFile } from 'react-icons/fc';
import SubtitlesNode from '../SubtitlesNode/SubtitlesNode';
import type { ModifiedDree } from '@subtitle-translator/shared';

const FileNode = ({ node }: { node: ModifiedDree<Dree> }) => {
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);

  return (
    <li>
      <div onClick={() => setShowSubtitles(!showSubtitles)}>
        <FcFile title={`File-${node.uuid}`} />
        {node.name}
      </div>
      {showSubtitles && <SubtitlesNode uuid={node.uuid} />}
    </li>
  );
};

export default FileNode;
