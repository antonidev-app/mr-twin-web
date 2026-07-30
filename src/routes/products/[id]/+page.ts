import { getProduct } from '$lib/api/catalog';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const { data: product } = await getProduct(params.id, fetch);
	return { product };
};
