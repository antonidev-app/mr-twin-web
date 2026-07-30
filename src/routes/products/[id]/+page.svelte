<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import ProductImage from '$lib/components/ProductImage.svelte';
	import { formatPrice } from '$lib/format';
	import { toast } from '$lib/stores/toast.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let quantity = $state(1);

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
	}
</script>

<svelte:head>
	<title>{data.product.name} — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-6">
	<nav class="mb-4 flex items-center gap-1.5 text-sm text-zinc-400">
		<a href={resolve('/')} class="hover:text-zinc-600">Katalog</a>
		{#if data.product.display_category}
			<span>/</span>
			<a
				href={resolve(
					`/?display_category=${encodeURIComponent(data.product.display_category)}` as PathnameWithSearchOrHash
				)}
				class="hover:text-zinc-600"
			>
				{data.product.display_category}
			</a>
		{/if}
	</nav>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
			<ProductImage
				src={data.product.images[0]}
				alt={data.product.name}
				class="h-full w-full object-cover"
			/>
		</div>

		<div>
			<div class="mb-2 flex items-center gap-2 text-xs text-zinc-400">
				{#if data.product.brand}
					<span>{data.product.brand}</span>
					<span>·</span>
				{/if}
				<span>SKU {data.product.sku}</span>
			</div>
			<h1 class="mb-3 text-xl font-bold text-zinc-900">{data.product.name}</h1>
			<p class="mb-4 text-3xl font-bold text-zinc-900">{formatPrice(data.product.price)}</p>

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
				<p class="mb-6 text-sm leading-relaxed text-zinc-600">{data.product.description}</p>
			{/if}

			{#if data.product.stock > 0}
				<div class="flex items-center gap-3">
					<div class="flex items-center rounded-md border border-zinc-200">
						<button
							type="button"
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							class="px-3 py-2 text-zinc-500 hover:bg-zinc-50"
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
							class="px-3 py-2 text-zinc-500 hover:bg-zinc-50"
							aria-label="Tambah jumlah"
						>
							+
						</button>
					</div>
					<button
						onclick={addToCart}
						class="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
					>
						Tambah ke Keranjang
					</button>
				</div>
			{:else}
				<button
					disabled
					class="w-full cursor-not-allowed rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-400"
				>
					Stok Habis
				</button>
			{/if}
		</div>
	</div>
</div>
