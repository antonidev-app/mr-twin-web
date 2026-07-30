<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatPrice } from '$lib/format';
	import { cart } from '$lib/stores/cart.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let quantity = $state(1);
	let added = $state(false);

	function addToCart() {
		cart.add(
			{ productId: data.product.id, name: data.product.name, price: data.product.price },
			quantity
		);
		added = true;
		setTimeout(() => (added = false), 2000);
	}
</script>

<svelte:head>
	<title>{data.product.name} — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href={resolve('/')} class="mb-4 inline-block text-sm text-gray-500 hover:underline"
		>&larr; Kembali ke katalog</a
	>

	<div class="rounded-lg border border-gray-200 p-6">
		<span class="text-xs text-gray-400">{data.product.display_category ?? '—'}</span>
		{#if data.product.brand}
			<span class="ml-2 text-xs text-gray-400">· {data.product.brand}</span>
		{/if}
		<h1 class="mt-1 mb-3 text-xl font-bold text-gray-900">{data.product.name}</h1>
		<p class="mb-1 text-sm text-gray-400">SKU: {data.product.sku}</p>
		<p class="mb-4 text-2xl font-semibold text-gray-900">{formatPrice(data.product.price)}</p>

		{#if data.product.description}
			<p class="mb-4 text-sm text-gray-600">{data.product.description}</p>
		{/if}

		<p class="mb-4 text-sm {data.product.stock > 0 ? 'text-green-600' : 'text-red-500'}">
			{data.product.stock > 0 ? `Stok tersedia: ${data.product.stock}` : 'Stok habis'}
		</p>

		{#if data.product.stock > 0}
			<div class="flex items-center gap-3">
				<input
					type="number"
					min="1"
					max={data.product.stock}
					bind:value={quantity}
					class="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
				/>
				<button
					onclick={addToCart}
					class="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
				>
					{added ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
				</button>
			</div>
		{:else}
			<button
				disabled
				class="cursor-not-allowed rounded bg-gray-200 px-4 py-2 text-sm text-gray-400"
			>
				Stok Habis
			</button>
		{/if}
	</div>
</div>
