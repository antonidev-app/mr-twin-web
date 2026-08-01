<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { getRelatedProducts } from '$lib/api/catalog';
	import type { Product } from '$lib/api/types';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import ProductImage from '$lib/components/ProductImage.svelte';
	import { formatPrice } from '$lib/format';
	import { toast } from '$lib/stores/toast.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let quantity = $state(1);

	let justAdded = $state(false);

	let related = $state<Product[]>([]);
	let relatedLoading = $state(true);

	// Keyed on product id (not onMount) — SvelteKit reuses this component
	// instance when navigating between /products/[id] pages (e.g. clicking a
	// related product), so this needs to re-run on every product change.
	$effect(() => {
		const productId = data.product.id;
		relatedLoading = true;

		getRelatedProducts(productId)
			.then((result) => {
				related = result.data;
			})
			.catch(() => {
				related = [];
			})
			.finally(() => {
				relatedLoading = false;
			});
	});

	function addToCart() {
		cart.add(
			{
				productId: data.product.id,
				name: data.product.name,
				price: data.product.price,
				image: data.product.images[0] ?? null
			},
			quantity
		);
		toast.show(`${data.product.name} ditambahkan ke keranjang`);
		justAdded = true;
		setTimeout(() => (justAdded = false), 400);
	}
</script>

<svelte:head>
	<title>{data.product.name} — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6">
	<nav class="mb-4 flex items-center gap-1.5 text-sm text-zinc-500">
		<a href={resolve('/')} class="hover:text-accent-700">Katalog</a>
		{#if data.product.display_category}
			<span>/</span>
			<a
				href={resolve(
					`/?display_category=${encodeURIComponent(data.product.display_category)}` as PathnameWithSearchOrHash
				)}
				class="hover:text-accent-700"
			>
				{data.product.display_category}
			</a>
		{/if}
	</nav>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="aspect-square overflow-hidden rounded-lg bg-zinc-100">
			<ProductImage
				src={data.product.images[0]}
				alt={data.product.name}
				class="h-full w-full object-cover"
			/>
		</div>

		<div>
			<div class="mb-2 flex items-center gap-2 text-xs text-zinc-500">
				{#if data.product.brand}
					<span>{data.product.brand}</span>
					<span>·</span>
				{/if}
				<span class="font-mono">SKU {data.product.sku}</span>
			</div>
			<h1 class="mb-3 text-xl font-semibold tracking-tight text-zinc-900">{data.product.name}</h1>
			<p class="mb-4 font-mono text-3xl font-bold text-zinc-900 tabular-nums">
				{formatPrice(data.product.price)}
			</p>

			<div class="mb-6">
				{#if data.product.stock > 0}
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
						Stok tersedia · {data.product.stock}
					</span>
				{:else}
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
						Stok habis
					</span>
				{/if}
			</div>

			{#if data.product.description}
				<p class="mb-6 max-w-[60ch] text-sm leading-relaxed whitespace-pre-line text-zinc-600">
					{data.product.description}
				</p>
			{/if}

			{#if data.product.stock > 0}
				<div class="flex items-center gap-3">
					<div class="flex items-center rounded-lg border border-zinc-200">
						<button
							type="button"
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							class="px-3 py-2 text-zinc-500 transition hover:bg-zinc-50 active:scale-[0.98]"
							aria-label="Kurangi jumlah"
						>
							−
						</button>
						<input
							type="number"
							min="1"
							max={data.product.stock}
							bind:value={quantity}
							class="w-14 [appearance:textfield] border-x border-zinc-200 py-2 text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						/>
						<button
							type="button"
							onclick={() => (quantity = Math.min(data.product.stock, quantity + 1))}
							class="px-3 py-2 text-zinc-500 transition hover:bg-zinc-50 active:scale-[0.98]"
							aria-label="Tambah jumlah"
						>
							+
						</button>
					</div>
					<button
						onclick={addToCart}
						class="flex-1 rounded-lg bg-accent-400 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] {justAdded
							? 'motion-safe:animate-[pulse-once_0.4s_ease-out]'
							: ''}"
					>
						Tambah ke Keranjang
					</button>
				</div>
			{:else}
				<button
					disabled
					class="w-full cursor-not-allowed rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-400"
				>
					Stok Habis
				</button>
			{/if}
		</div>
	</div>

	{#if relatedLoading || related.length > 0}
		<div class="mt-12">
			<h2 class="mb-4 text-lg font-semibold tracking-tight text-zinc-900">Produk Terkait</h2>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
				{#if relatedLoading}
					{#each Array(4) as _, i (i)}
						<div class="aspect-square animate-pulse rounded-lg bg-zinc-100"></div>
					{/each}
				{:else}
					{#each related as product (product.id)}
						<ProductCard {product} />
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
