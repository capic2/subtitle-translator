import { render, screen } from '@testing-library/react';
import React from 'react';
import SubtitleText from './SubtitleText';
import { describe, it } from 'vitest';
import {
  Addic7edSubtitle,
  ExternalSubtitle,
  InternalSubtitle,
} from '@subtitle-translator/shared';
import { userEvent } from '@storybook/testing-library';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

describe('SubtitleText', () => {
  it('renders the component', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText
          subtitle={{
            language: 'fr',
            number: 1,
            type: 'utf',
            origin: 'Internal',
            uuid: '1',
          }}
          isLoading={false}
          fileUuid="1"
        />
      </QueryClientProvider>
    );

    expect(screen.getByText(/fr/)).toBeInTheDocument();
  });

  it('renders the subtitle name if exists', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText
          subtitle={{
            language: 'fr',
            number: 1,
            type: 'utf',
            name: 'the name',
            origin: 'Internal',
            uuid: '1',
          }}
          isLoading={false}
          fileUuid="1"
        />
      </QueryClientProvider>
    );

    expect(screen.getByText(/fr - the name/)).toBeInTheDocument();
  });

  it('renders the loading', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText
          subtitle={{
            language: 'fr',
            number: 1,
            type: 'utf',
            name: 'the name',
            origin: 'Internal',
            uuid: '1',
          }}
          isLoading={true}
          fileUuid="1"
        />
      </QueryClientProvider>
    );

    expect(screen.getByRole('progressbar')).toHaveClass('icon-loading');
  });

  it('renders the trash if external', () => {
    const subtitle: ExternalSubtitle = {
      origin: 'External',
      uuid: '1',
      name: 'external subtitle',
      path: '/path/external/subtitle',
      language: 'fr',
    };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText subtitle={subtitle} isLoading={false} fileUuid="1" />
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: 'trash' })).toBeInTheDocument();
  });
  it('does not render the trash if internal', () => {
    const subtitle: InternalSubtitle = {
      origin: 'Internal',
      uuid: '1',
      name: 'internal subtitle',
      language: 'fr',
      number: 1,
      type: 'a',
    };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText subtitle={subtitle} isLoading={false} fileUuid="1" />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole('button', { name: 'trash' })
    ).not.toBeInTheDocument();
  });
  it('does not render the trash if addicted', async () => {
    const subtitle: Addic7edSubtitle = {
      origin: 'Addic7ed',
      uuid: '1',
      name: 'addic7ed subtitle',
      language: 'fr',
      link: 'a',
      referer: 'a',
    };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText subtitle={subtitle} isLoading={false} fileUuid="1" />
      </QueryClientProvider>
    );

    expect(
      screen.getByRole('button', { name: 'trash' })
    ).not.toBeInTheDocument();
  });

  it('set language to unknown if not defined', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText
          subtitle={{
            number: 1,
            type: 'utf',
            name: '',
            origin: 'Internal',
            uuid: '1',
          }}
          isLoading={false}
          fileUuid="1"
        />
      </QueryClientProvider>
    );

    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('it deletes a file', async () => {
    const subtitle: ExternalSubtitle = {
      origin: 'External',
      uuid: '1',
      name: 'external subtitle',
      path: '/path/external/subtitle',
      language: 'fr',
    };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleText subtitle={subtitle} isLoading={false} fileUuid="1" />
      </QueryClientProvider>
    );

    expect(screen.getByText(subtitle.name!)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'trash' }));

    expect(screen.getByText(subtitle.name!)).not.toBeInTheDocument();
  });
});
