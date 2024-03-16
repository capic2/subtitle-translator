import { describe } from 'vitest';
import { AppConfigProvider, useAppConfigProvider } from './AppConfigProvider';
import { render, screen } from '@testing-library/react';

describe('AppConfigProvider', () => {
  const DummyComponent = () => {
    const { apiUrl } = useAppConfigProvider();

    return <>{apiUrl}</>;
  };

  it('provides expected context to child', () => {
    render(<AppConfigProvider apiUrl="http://localhost"><DummyComponent /></AppConfigProvider>)

    expect(screen.getByText('http://localhost')).toBeInTheDocument()
  })
});
