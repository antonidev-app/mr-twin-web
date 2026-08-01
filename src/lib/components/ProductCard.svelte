<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatPrice } from '$lib/format';
	import type { Product } from '$lib/api/types';
	import ProductImage from './ProductImage.svelte';

	let { product }: { product: Product } = $props();
</script>

<a
	href={resolve('/products/[id]', { id: String(product.id) })}
	class="group flex flex-col overflow-hidden rounded-lg bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-900/5"
>
	<div class="relative aspect-square w-full overflow-hidden bg-zinc-100">
		<ProductImage
			src={product.images[0]}
			alt={product.name}
			class="h-full w-full object-cover transition group-hover:scale-105"
		/>
		{#if product.stock <= 0}
			<span
				class="absolute top-2 left-2 rounded-full bg-zinc-900/85 px-2 py-0.5 text-xs font-medium text-white"
			>
				Stok Habis
			</span>
		{/if}
	</div>
	<div class="flex flex-1 flex-col gap-1 p-3">
		<span class="text-xs text-zinc-500">{product.display_category ?? '—'}</span>
		<span class="line-clamp-2 flex-1 text-sm font-medium text-zinc-800">{product.name}</span>
		<span class="font-mono text-base font-semibold text-zinc-900 tabular-nums"
			>{formatPrice(product.price)}</span
		>
	</div>
</a>
