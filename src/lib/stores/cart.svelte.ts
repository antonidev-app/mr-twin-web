import { browser } from '$app/environment';

export type CartItem = {
	productId: number;
	name: string;
	price: number;
	image?: string | null;
	quantity: number;
};

const STORAGE_KEY = 'mr_twin_cart';

function loadInitial(): CartItem[] {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
	} catch {
		return [];
	}
}

class CartStore {
	items = $state<CartItem[]>(loadInitial());

	total = $derived(this.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
	itemCount = $derived(this.items.reduce((sum, item) => sum + item.quantity, 0));

	#persist() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
	}

	add(item: Omit<CartItem, 'quantity'>, quantity = 1) {
		const existing = this.items.find((i) => i.productId === item.productId);
		if (existing) {
			existing.quantity += quantity;
		} else {
			this.items.push({ ...item, quantity });
		}
		this.#persist();
	}

	updateQuantity(productId: number, quantity: number) {
		if (quantity <= 0) {
			this.remove(productId);
			return;
		}
		const item = this.items.find((i) => i.productId === productId);
		if (item) item.quantity = quantity;
		this.#persist();
	}

	remove(productId: number) {
		this.items = this.items.filter((i) => i.productId !== productId);
		this.#persist();
	}

	clear() {
		this.items = [];
		this.#persist();
	}
}

export const cart = new CartStore();
