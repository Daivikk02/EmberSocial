import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Ember Social app', () => {
  render(<App />);
  const logoElement = screen.getByText(/Ember/i);
  expect(logoElement).toBeInTheDocument();
});
