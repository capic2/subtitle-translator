import { createContext, ReactNode, useContext } from 'react';

interface AppConfig {
  apiUrl: string;
}

export const AppConfigContext = createContext<AppConfig>({ apiUrl: '' });

export const AppConfigProvider = ({
  children,
  apiUrl,
}: {
  children: ReactNode;
  apiUrl: string;
}) => {
  if (!apiUrl) {
    throw new Error('No base url provider');
  }

  console.log(`Backend url: ${apiUrl}`);

  return (
    <AppConfigContext.Provider value={{ apiUrl: apiUrl }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfigProvider = () => {
  return useContext(AppConfigContext);
};
