import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Dree, Type } from 'dree';
import FolderNode from '../FolderNode/FolderNode';
import FileNode from '../FileNode/FileNode';
import React from 'react';
import type { ModifiedDree } from '@subtitle-translator/shared';

const fetchFolder = async (uuid: string) => {
  return await axios.get(
    `http://192.168.1.106:3333/api/directories/${uuid}/files`,
  );
};

interface Props {
  uuid: string;
}

const FolderContent = ({ uuid }: Props) => {
  const { data, error, isLoading } = useQuery<
    unknown,
    unknown,
    { data: ModifiedDree<Dree> }
  >({
    queryKey: ['fetchFolderContent', uuid],
    queryFn: () => fetchFolder(uuid),
    refetchOnWindowFocus: false,
  });

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
      {data.data.children?.map((child) =>
        child.type === Type.DIRECTORY ? (
          <FolderNode key={child.uuid} node={child} />
        ) : (
          <FileNode key={child.hash} node={child} />
        ),
      )}
    </ul>
  );
};

export default FolderContent;
