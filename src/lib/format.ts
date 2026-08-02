export function formatPrice(value: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(value);
}

const STATUS_STYLES: Record<string, string> = {
	pending: 'bg-accent-50 text-accent-800',
	processing: 'bg-blue-50 text-blue-700',
	shipped: 'bg-purple-50 text-purple-700',
	completed: 'bg-green-50 text-green-700',
	cancelled: 'bg-red-50 text-red-600'
};

export function orderStatusClass(status: string): string {
	return STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600';
}
