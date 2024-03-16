import { describe, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import SubtitlesNode from './SubtitlesNode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

describe('SubtitlesNode', () => {
  it('renders the node', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitlesNode uuid="d0d2d1f1" />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Addic7ed')).toBeInTheDocument();
  });

  describe('addSubtitle', () => {
    it.skip('adds the new subtitle when it is downloaded', async () => {
      render(
        <QueryClientProvider client={new QueryClient()}>
          <SubtitlesNode uuid="d0d2d1f1" />
        </QueryClientProvider>
      );

      expect(await screen.findByText('External')).not.toBeInTheDocument();

      await userEvent.click(
        within(await screen.findByText('Addic7ed')).getByText('fr - a')
      );

      expect(
        within(await screen.findByText('External')).getByText(
          'new subtitles.srt'
        )
      ).toBeInTheDocument();
    });
    it.todo('add the new subtitle when it is translated')
  });
});
