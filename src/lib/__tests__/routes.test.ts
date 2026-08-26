import { describe, it, expect } from "vitest";

describe("Route Restructuring & Public vs Protected Rules", () => {
  it("should determine public routes correctly", () => {
    const isPublic = (path: string) => path === "/" || path === "/login" || path.startsWith("/api/");

    expect(isPublic("/")).toBe(true);
    expect(isPublic("/login")).toBe(true);
    expect(isPublic("/api/contacts/template")).toBe(true);
    expect(isPublic("/dashboard")).toBe(false);
    expect(isPublic("/contacts/cnt_123")).toBe(false);
    expect(isPublic("/settings")).toBe(false);
  });

  it("should determine protected routes redirect behavior", () => {
    const getRedirect = (path: string, isAuthenticated: boolean) => {
      const isPublic = path === "/" || path === "/login" || path.startsWith("/api/");
      if (!isAuthenticated && !isPublic) {
        return "/login";
      }
      if (isAuthenticated && path === "/login") {
        return "/dashboard";
      }
      return null;
    };

    // Unauthenticated user attempting to access dashboard
    expect(getRedirect("/dashboard", false)).toBe("/login");
    expect(getRedirect("/contacts/cnt_123", false)).toBe("/login");

    // Unauthenticated user viewing landing page
    expect(getRedirect("/", false)).toBeNull();

    // Authenticated user navigating to login
    expect(getRedirect("/login", true)).toBe("/dashboard");

    // Authenticated user viewing dashboard
    expect(getRedirect("/dashboard", true)).toBeNull();
  });
});
