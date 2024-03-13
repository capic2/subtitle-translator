import { describe, expect } from 'vitest';
import {
  Addic7edSubtitle,
  ExternalSubtitle,
  InternalSubtitle,
} from '@subtitle-translator/shared';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import SubtitleNode from './SubtitleNode';
import userEvent from '@testing-library/user-event';

describe('SubtitleNode', () => {
  it.todo('renders the component');
  it('downloads the file if subtitle is Addic7ed', async () => {
    const subtitle: Addic7edSubtitle = {
      referer: '/a/b',
      origin: 'Addic7ed',
      uuid: '1',
      name: 'a',
      link: '/abc.html',
      language: 'fr',
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleNode subtitle={subtitle} fileUuid="1" addSubtitle={vi.fn()} />
      </QueryClientProvider>
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByRole('listitem'));

    expect(spy).toHaveBeenCalledWith(
      '/api/subtitles/download',
      {
        link: '/abc.html',
        referer: '/a/b',
        uuid: '1',
        language: 'fr',
      }
    );
  });
  it('translates the file if subtitle is Internal', async () => {
    const subtitle: InternalSubtitle = {
      number: 3,
      language: undefined,
      type: 'utf8',
      name: 'SDH',
      uuid: '1',
      origin: 'Internal',
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleNode subtitle={subtitle} fileUuid="1" addSubtitle={vi.fn()} />
      </QueryClientProvider>
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByRole('listitem'));

    expect(spy).toHaveBeenCalledWith(
      '/api/subtitles/translate',
      {
        number: 3,
        uuid: '1',
      }
    );
  });
  it('does nothing if subtitle is External', async () => {
    const subtitle: ExternalSubtitle = {
      origin: 'External',
      uuid: '1',
      name: 'a',
      language: 'en',
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleNode subtitle={subtitle} fileUuid="1" addSubtitle={vi.fn()} />
      </QueryClientProvider>
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByRole('listitem'));

    expect(spy).not.toHaveBeenCalled();
  });
});
