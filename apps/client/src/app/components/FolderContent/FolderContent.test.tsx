import { describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import FolderContent from './FolderContent';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

describe('FolderContent', () => {
  it('renders folders', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <FolderContent uuid="d0" />
      </QueryClientProvider>
    );

    expect((await screen.findAllByTitle(/Folder-.*/)).length).toBeGreaterThan(
      0
    );
  });

  it('renders files', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <FolderContent uuid="d0" />
      </QueryClientProvider>
    );

    expect((await screen.findAllByTitle(/File-.*/)).length).toBeGreaterThan(0);
  });
});
