import { apiFetch } from './client';
import type { Customer } from './types';

type AuthResponse = { customer: Customer; token: string };

export function register(
	payload: {
		name: string;
		email: string;
		phone?: string;
		password: string;
		password_confirmation: string;
	},
	fetchFn?: typeof fetch
) {
	return apiFetch<AuthResponse>('/api/auth/register', {
		method: 'POST',
		body: payload,
		fetch: fetchFn
	});
}

export function login(payload: { email: string; password: string }, fetchFn?: typeof fetch) {
	return apiFetch<AuthResponse>('/api/auth/login', {
		method: 'POST',
		body: payload,
		fetch: fetchFn
	});
}

export function logout(token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ message: string }>('/api/auth/logout', {
		method: 'POST',
		token,
		fetch: fetchFn
	});
}
