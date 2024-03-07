import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubtitlesNode from './SubtitlesNode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('SubtitlesNode', () => {
  it('renders the node', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitlesNode uuid="1" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Addic7ed')).toBeInTheDocument();
  });
});
