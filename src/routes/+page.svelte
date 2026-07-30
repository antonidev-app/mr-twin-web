<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { formatPrice } from '$lib/format';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let q = $state('');
	let displayCategory = $state('');
	let brand = $state('');
	let minPrice = $state('');
	let maxPrice = $state('');

	// Resync the filter form whenever `data` changes (pagination, browser
	// back/forward, or a fresh `load` after navigating) — a plain $state
	// initializer only captures data.filters once and would otherwise go
	// stale on subsequent navigations that don't remount this component.
	$effect(() => {
		q = data.filters.q ?? '';
		displayCategory = data.filters.display_category ?? '';
		brand = data.filters.brand ?? '';
		minPrice = data.filters.min_price ?? '';
		maxPrice = data.filters.max_price ?? '';
	});

	function applyFilters(e: SubmitEvent) {
		e.preventDefault();
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (displayCategory) params.set('display_category', displayCategory);
		if (brand) params.set('brand', brand);
		if (minPrice) params.set('min_price', String(minPrice));
		if (maxPrice) params.set('max_price', String(maxPrice));
		goto(resolve(`/?${params.toString()}`));
	}

	function goToPage(pageNumber: number) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		params.set('page', String(pageNumber));
		goto(resolve(`/?${params.toString()}`));
	}
</script>

<svelte:head>
	<title>Mr. Twin — Katalog</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Katalog Produk</h1>

	<form
		onsubmit={applyFilters}
		class="mb-8 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 sm:grid-cols-3 md:grid-cols-5"
	>
		<input
			type="text"
			placeholder="Cari produk..."
			bind:value={q}
			class="col-span-2 rounded border border-gray-300 px-3 py-2 text-sm sm:col-span-1 md:col-span-2"
		/>
		<select bind:value={displayCategory} class="rounded border border-gray-300 px-3 py-2 text-sm">
			<option value="">Semua Kategori</option>
			{#each data.categories as category (category)}
				<option value={category}>{category}</option>
			{/each}
		</select>
		<input
			type="text"
			placeholder="Brand"
			bind:value={brand}
			class="rounded border border-gray-300 px-3 py-2 text-sm"
		/>
		<input
			type="number"
			placeholder="Harga min"
			bind:value={minPrice}
			class="rounded border border-gray-300 px-3 py-2 text-sm"
		/>
		<input
			type="number"
			placeholder="Harga max"
			bind:value={maxPrice}
			class="rounded border border-gray-300 px-3 py-2 text-sm"
		/>
		<button
			type="submit"
			class="col-span-2 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 sm:col-span-1 md:col-span-5"
		>
			Terapkan Filter
		</button>
	</form>

	{#if data.products.data.length === 0}
		<p class="text-gray-500">Tidak ada produk ditemukan.</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
			{#each data.products.data as product (product.id)}
				<a
					href={resolve('/products/[id]', { id: String(product.id) })}
					class="flex flex-col rounded-lg border border-gray-200 p-4 transition hover:shadow-md"
				>
					<span class="mb-1 text-xs text-gray-400">{product.display_category ?? '—'}</span>
					<span class="mb-2 line-clamp-2 flex-1 text-sm font-medium text-gray-900"
						>{product.name}</span
					>
					<span class="mb-1 text-base font-semibold text-gray-900"
						>{formatPrice(product.price)}</span
					>
					<span class="text-xs {product.stock > 0 ? 'text-green-600' : 'text-red-500'}">
						{product.stock > 0 ? `Stok: ${product.stock}` : 'Stok habis'}
					</span>
				</a>
			{/each}
		</div>

		{#if data.products.meta.last_page > 1}
			<div class="mt-8 flex items-center justify-center gap-2">
				{#each Array(data.products.meta.last_page) as _, i (i)}
					<button
						onclick={() => goToPage(i + 1)}
						class="rounded px-3 py-1 text-sm {data.products.meta.current_page === i + 1
							? 'bg-gray-900 text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					>
						{i + 1}
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>
