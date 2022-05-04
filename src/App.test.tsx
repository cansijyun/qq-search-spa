import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
 
import App from './App';
 
describe("<App />", () => {
 
  test('render qq input', () => {
    render(<App />);
    const inputEl = screen.getByTestId("qq-input");
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('input data change correctly', () => {
    render(<App />);
    const inputEl = screen.getByTestId("qq-input");
    userEvent.type(inputEl, "42692305");
    expect(inputEl).toBeInTheDocument();
    expect(screen.queryByTestId("qq-input")).toHaveValue("42692305");
    expect(screen.queryByTestId("input-not-valid")).not.toBeInTheDocument();
  });
});