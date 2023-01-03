import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

it("should render app with login form", () => {
  render(<App />);
  const linkElement = screen.getByText(/User Login:/i);
  expect(linkElement).toBeInTheDocument();
});
