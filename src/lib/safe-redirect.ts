import type { Pathname } from '$app/types';

const DEFAULT_REDIRECT: Pathname = '/';

/**
 * The `redirect` query param on /login and /register is attacker-controllable
 * (anyone can craft `?redirect=https://evil.com` or `?redirect=//evil.com`).
 * Only allow same-origin relative paths through, otherwise fall back to `/`.
 */
export function safeRedirectTarget(value: string | null): Pathname {
	if (value && value.startsWith('/') && !value.startsWith('//')) {
		return value as Pathname;
	}
	return DEFAULT_REDIRECT;
}
