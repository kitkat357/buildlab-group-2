import { fireEvent, render, screen } from "@testing-library/react";
import ResourceSearch from "@/components/ResourceSearch";

const resources = [
  {
    id: "resource-1",
    title: "Community Garden Guide",
    description: "Learn how to grow vegetables with your neighbors.",
    url: "https://example.com/garden",
  },
  {
    id: "resource-2",
    title: "Recycling Basics",
    description: "A practical guide to reducing household waste.",
    url: "https://example.com/recycling",
  },
];

describe("ResourceSearch", () => {
  it("renders without crashing", () => {
    render(<ResourceSearch resources={resources} />);

    expect(
      screen.getByRole("searchbox", { name: "Search resources" })
    ).toBeInTheDocument();
  });

  it("filters titles and descriptions case-insensitively", () => {
    render(<ResourceSearch resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "VEGETABLES" } }
    );

    expect(screen.getByText("Community Garden Guide")).toBeInTheDocument();
    expect(screen.queryByText("Recycling Basics")).not.toBeInTheDocument();
  });
});
