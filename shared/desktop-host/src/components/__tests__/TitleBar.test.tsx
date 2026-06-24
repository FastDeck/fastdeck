import { screen } from '@testing-library/react';
import { renderWithProvidersAndRouter } from '@testUtils';
import TitleBar from '../TitleBar';

describe('TitleBar', () => {
  it('renders TitleBar successfully', () => {
    renderWithProvidersAndRouter(<TitleBar />);

    // Check brand text
    expect(screen.getByText('FastDeck')).toBeInTheDocument();
  });
});
