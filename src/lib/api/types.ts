export type Product = {
	id: number;
	name: string;
	sku: string;
	price: number;
	stock: number;
	description: string | null;
	images: string[];
	display_category: string | null;
	brand: string | null;
};

export type PaginationLinks = {
	first: string | null;
	last: string | null;
	prev: string | null;
	next: string | null;
};

export type PaginationMeta = {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	from: number | null;
	to: number | null;
};

export type Paginated<T> = {
	data: T[];
	links: PaginationLinks;
	meta: PaginationMeta;
};

export type Customer = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
};

export type OrderItem = {
	item_name: string;
	sku: string | null;
	unit_price: number;
	quantity: number;
	subtotal: number;
};

export type Order = {
	id: number;
	order_number: string;
	status: string;
	total_amount: number;
	shipping_name: string;
	shipping_phone: string;
	shipping_address: string;
	created_at: string;
	items: OrderItem[];
};
