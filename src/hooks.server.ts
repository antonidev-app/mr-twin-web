import type { Handle } from '@sveltejs/kit';

// apiFetch (src/lib/api/client.ts) reads response.headers.get('content-type')
// to decide whether to parse JSON. SvelteKit strips all response headers
// from SSR-captured fetch calls by default (security default, since headers
// could leak sensitive data like Set-Cookie into the hydration payload) —
// this explicitly allows just the one header our client actually needs.
export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});
};
