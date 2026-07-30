import { apiFetch } from './client';
import type { Paginated, Product } from './types';

export type ProductFilters = {
	display_category?: string;
	brand?: string;
	min_price?: string | number;
	max_price?: string | number;
	q?: string;
	page?: string | number;
};

export function listProducts(filters: ProductFilters = {}, fetchFn?: typeof fetch) {
	return apiFetch<Paginated<Product>>('/api/catalog/products', {
		params: filters,
		fetch: fetchFn
	});
}

export function getProduct(id: number | string, fetchFn?: typeof fetch) {
	return apiFetch<{ data: Product }>(`/api/catalog/products/${id}`, { fetch: fetchFn });
}

export function listCategories(fetchFn?: typeof fetch) {
	return apiFetch<{ data: string[] }>('/api/catalog/categories', { fetch: fetchFn });
}
