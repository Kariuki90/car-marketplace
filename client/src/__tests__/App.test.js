import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

test('renders main navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  const homeLink = screen.getByText(/home/i);
  expect(homeLink).toBeInTheDocument();
});

test('renders login and register links when not authenticated', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  const loginLink = screen.getByText(/login/i);
  const registerLink = screen.getByText(/register/i);
  
  expect(loginLink).toBeInTheDocument();
  expect(registerLink).toBeInTheDocument();
}); 