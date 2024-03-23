import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Dree, Type } from 'dree';
import FolderNode from './components/FolderNode/FolderNode';
import FileNode from './components/FileNode/FileNode';
import type { ModifiedDree } from '@subtitle-translator/shared';
import { useAppConfigProvider } from './providers/AppConfigProvider';

const fetch = (baseUrl: string) => {
  return axios.get(`${baseUrl}/api/files`);
};

const App2 = () => {
  const { apiUrl } = useAppConfigProvider();
  const { data, error, isLoading } = useQuery<
    unknown,
    unknown,
    { data: ModifiedDree<Dree> }
  >({
    queryKey: ['fetch'],
    queryFn: () => fetch(apiUrl),
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
    <div className="App">
      <div>{data.data.name}</div>
      <ul>
        {data.data.children?.map((child) =>
          child.type === Type.DIRECTORY ? (
            <FolderNode key={child.uuid} node={child} />
          ) : (
            <FileNode key={child.uuid} node={child} />
          )
        )}
      </ul>
    </div>
  );
};

export default App2;
