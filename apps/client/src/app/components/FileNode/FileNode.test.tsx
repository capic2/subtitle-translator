import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FileNode from './FileNode';
import type { Type } from 'dree';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

describe('FileNode', () => {
  it('renders', () => {
    render(<FileNode node={{ name: 'file 1', uuid: '1', type: Type.FILE }} />);

    expect(screen.getByText('file 1')).toBeInTheDocument();
  });

  it('renders the subtitles when click', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <FileNode
          node={{ name: 'file 1', uuid: 'd0d2d1f1', type: Type.FILE }}
        />
      </QueryClientProvider>
    );

    await userEvent.click(screen.getByText('file 1'));

    expect(screen.getByText('Internal')).toBeInTheDocument();
  });
});
