import { describe, it, expect, vi } from "vitest";
import { linePlugin } from "./channel.js";
import { DEFAULT_ACCOUNT_ID, type ResolvedLineAccount } from "clawdbot/plugin-sdk";

describe("linePlugin.status", () => {
  const mockAccount: ResolvedLineAccount = {
    accountId: "default",
    name: "Line Bot",
    enabled: true,
    channelAccessToken: "token123",
    channelSecret: "secret123",
    tokenSource: "config",
    config: {},
  };

  describe("collectStatusIssues", () => {
    it("returns no issues for a fully configured account", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: mockAccount,
        runtime: { running: true } as any,
        probe: { ok: true } as any,
      });

      const issues = linePlugin.status!.collectStatusIssues!([snapshot]);
      expect(issues).toHaveLength(0);
    });

    it("identifies missing channel access token", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: { ...mockAccount, channelAccessToken: "" },
        runtime: { running: false } as any,
        probe: null as any,
      });

      const issues = linePlugin.status!.collectStatusIssues!([snapshot]);
      expect(issues).toEqual([
        expect.objectContaining({
          kind: "config",
          message: expect.stringContaining("access token not configured"),
        }),
      ]);
    });

    it("identifies missing channel secret", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: { ...mockAccount, channelSecret: "" },
        runtime: { running: false } as any,
        probe: null as any,
      });

      const issues = linePlugin.status!.collectStatusIssues!([snapshot]);
      expect(issues).toEqual([
        expect.objectContaining({
          kind: "config",
          message: expect.stringContaining("secret not configured"),
        }),
      ]);
    });

    it("identifies probe failures", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: mockAccount,
        runtime: { running: true } as any,
        probe: { ok: false, error: "401 Unauthorized" } as any,
      });

      const issues = linePlugin.status!.collectStatusIssues!([snapshot]);
      expect(issues).toEqual([
        expect.objectContaining({
          kind: "runtime",
          message: expect.stringContaining("probe failed: 401 Unauthorized"),
        }),
      ]);
    });
  });

  describe("buildAccountSnapshot", () => {
    it("sets configured correctly when both token and secret are present", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: mockAccount,
        runtime: { running: true } as any,
        probe: { ok: true } as any,
      });
      expect(snapshot.configured).toBe(true);
    });

    it("sets configured to false if token is missing", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: { ...mockAccount, channelAccessToken: "" },
        runtime: { running: false } as any,
        probe: null as any,
      });
      expect(snapshot.configured).toBe(false);
    });

    it("sets configured to false if secret is missing", () => {
      const snapshot = linePlugin.status!.buildAccountSnapshot!({
        account: { ...mockAccount, channelSecret: "" },
        runtime: { running: false } as any,
        probe: null as any,
      });
      expect(snapshot.configured).toBe(false);
    });
  });
});
