import DashboardPage from "@/app/(dashboard-layout)/dashboard/page";
import { render, screen } from "@testing-library/react";

describe("Dashboard", () => {
  it("here should be a button", () => {
    render(<DashboardPage />);

    const btn = screen.getByText("Add");
    expect(btn).toBeInTheDocument();
  });
});
