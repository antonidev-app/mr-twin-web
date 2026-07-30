import { listCategories, listProducts } from '$lib/api/catalog';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const filters = {
		display_category: url.searchParams.get('display_category') ?? undefined,
		brand: url.searchParams.get('brand') ?? undefined,
		min_price: url.searchParams.get('min_price') ?? undefined,
		max_price: url.searchParams.get('max_price') ?? undefined,
		q: url.searchParams.get('q') ?? undefined,
		page: url.searchParams.get('page') ?? undefined
	};

	const [products, categories] = await Promise.all([
		listProducts(filters, fetch),
		listCategories(fetch)
	]);

	return { products, categories: categories.data, filters };
};
