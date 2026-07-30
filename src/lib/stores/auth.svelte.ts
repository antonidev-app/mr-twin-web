import { browser } from '$app/environment';
import type { Customer } from '$lib/api/types';

const STORAGE_KEY = 'mr_twin_auth';

type Session = { token: string; customer: Customer };

function loadInitial(): Session | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

class AuthStore {
	#session = $state<Session | null>(loadInitial());

	get token() {
		return this.#session?.token ?? null;
	}

	get customer() {
		return this.#session?.customer ?? null;
	}

	get isLoggedIn() {
		return this.#session !== null;
	}

	setSession(token: string, customer: Customer) {
		this.#session = { token, customer };
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#session));
	}

	clear() {
		this.#session = null;
		if (browser) localStorage.removeItem(STORAGE_KEY);
	}
}

export const auth = new AuthStore();
