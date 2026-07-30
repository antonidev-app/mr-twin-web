import { apiFetch } from './client';
import type { Order, Paginated } from './types';

export function listOrders(token: string, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<Order>>('/api/orders', { token, fetch: fetchFn });
}

export function getOrder(id: number | string, token: string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: Order }>(`/api/orders/${id}`, { token, fetch: fetchFn });
}

export function checkout(
	payload: {
		items: { product_id: number; quantity: number }[];
		shipping_name: string;
		shipping_phone: string;
		shipping_address: string;
	},
	token: string,
	fetchFn?: typeof fetch
) {
	return apiFetch<{ data: Order }>('/api/orders', {
		method: 'POST',
		body: payload,
		token,
		fetch: fetchFn
	});
}
