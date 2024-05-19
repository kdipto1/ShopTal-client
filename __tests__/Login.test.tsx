import LoginPage from "@/app/login/page";
import { render, screen } from "@testing-library/react";

describe("Login", () => {
  it("should be a button", () => {
    render(<LoginPage />);

    const loginButton = screen.getByText("Login");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveRole("button");
  });
});
