/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated by verifying token existence
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("token");
  return !!token;
}

/**
 * Get the current access token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem("token");
}

/**
 * Get the current refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem("refresh_token");
}

/**
 * Get the current user ID
 */
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem("user_id");
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
}

/**
 * Store auth tokens and user ID
 */
export function setAuthData(accessToken: string, refreshToken: string, userId: string): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  localStorage.setItem("user_id", userId);
}
