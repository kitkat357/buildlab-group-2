import { describe, expect, it, jest } from "@jest/globals";
import { renderToString } from "react-dom/server";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: null,
  }),
}));

describe("NewEventForm", () => {
  it("renders without crashing", async () => {
    const { default: NewEventForm } = await import(
      "../src/components/NewEventForm"
    );

    expect(() =>
      renderToString(<NewEventForm communityId="community-1" />),
    ).not.toThrow();
  });
});
