import type { TwitchAccountConfig, TwitchChatMessage } from "./types.js";

/**
 * Checks if an incoming Twitch message is allowed based on allowFrom and allowedRoles.
 */
export function checkTwitchAccessControl(params: {
  message: TwitchChatMessage;
  account: TwitchAccountConfig;
  botUsername: string;
}): { allowed: boolean; reason?: string } {
  const { message, account, botUsername } = params;

  // 1. Check allowFrom (Twitch user IDs)
  const allowFrom = account.allowFrom;
  if (Array.isArray(allowFrom) && allowFrom.length > 0) {
    if (!message.userId) {
      return { allowed: false, reason: "allowFrom configured but message has no user ID" };
    }
    if (!allowFrom.includes(message.userId)) {
      return { allowed: false, reason: `User ID ${message.userId} not in allowFrom list` };
    }
  }

  // 2. Check allowedRoles (Twitch roles like 'broadcaster', 'moderator', 'vip', 'subscriber', 'prime')
  const allowedRoles = account.allowedRoles;
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!message.userRoles || message.userRoles.length === 0) {
      return { allowed: false, reason: "allowedRoles configured but message has no user roles" };
    }
    const hasAllowedRole = allowedRoles.some((role) => message.userRoles?.includes(role));
    if (!hasAllowedRole) {
      return { allowed: false, reason: `User roles ${message.userRoles.join(", ")} not in allowedRoles list` };
    }
  }

  return { allowed: true };
}