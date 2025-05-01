import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../../pages/Home';
import FavoritePage from '../../pages/Favorites';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const server = setupServer(
  rest.get('http://localhost:3000/api/favorites/all', (req, res, ctx) => {
    return res(ctx.json([{ countryId: 'USA' }]));
  }),
  rest.get('https://restcountries.com/v3.1/alpha', (req, res, ctx) => {
    return res(ctx.json([{
      cca3: 'USA',
      name: { common: 'United States' },
      population: 331002651,
      flags: { png: 'https://flagcdn.com/us.png' }
    }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Favorites Integration', () => {
  test('full favorites flow with authentication', async () => {
    localStorage.setItem('token', 'fake-token');
    
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<FavoritePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Navigate to favorites
    fireEvent.click(screen.getByText('Favorites'));

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    // Remove favorite
    fireEvent.click(screen.getByLabelText(/remove favorite/i));
    
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
    });
  });
});