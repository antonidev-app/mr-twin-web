<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ProductCard from '$lib/components/ProductCard.svelte';
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

	function applyFilters(e?: SubmitEvent) {
		e?.preventDefault();
		const params = new SvelteURLSearchParams();
		if (q) params.set('q', q);
		if (displayCategory) params.set('display_category', displayCategory);
		if (brand) params.set('brand', brand);
		if (minPrice) params.set('min_price', String(minPrice));
		if (maxPrice) params.set('max_price', String(maxPrice));
		goto(resolve(`/?${params.toString()}`));
	}

	function clearFilters() {
		displayCategory = '';
		brand = '';
		minPrice = '';
		maxPrice = '';
		applyFilters();
	}

	function goToPage(pageNumber: number) {
		const params = new SvelteURLSearchParams(page.url.searchParams);
		params.set('page', String(pageNumber));
		goto(resolve(`/?${params.toString()}`));
	}

	let hasActiveFilters = $derived(!!(displayCategory || brand || minPrice || maxPrice));
</script>

<svelte:head>
	<title>Mr. Twin — Katalog</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-6">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-zinc-900">Katalog Produk</h1>
			<p class="text-sm text-zinc-500">{data.products.meta.total} produk tersedia</p>
		</div>
	</div>

	<div class="flex flex-col gap-6 lg:flex-row">
		<aside class="shrink-0 lg:w-56">
			<form onsubmit={applyFilters} class="space-y-5">
				<div class="sm:hidden">
					<label
						class="mb-1 block text-xs font-semibold tracking-wide text-zinc-500 uppercase"
						for="q-mobile"
					>
						Cari
					</label>
					<input
						id="q-mobile"
						type="text"
						placeholder="Cari produk..."
						bind:value={q}
						class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
					/>
				</div>

				<div>
					<span class="mb-2 block text-xs font-semibold tracking-wide text-zinc-500 uppercase"
						>Kategori</span
					>
					<div class="space-y-1.5">
						<label class="flex items-center gap-2 text-sm text-zinc-700">
							<input type="radio" bind:group={displayCategory} value="" class="accent-blue-600" />
							Semua Kategori
						</label>
						{#each data.categories as category (category)}
							<label class="flex items-center gap-2 text-sm text-zinc-700">
								<input
									type="radio"
									bind:group={displayCategory}
									value={category}
									class="accent-blue-600"
								/>
								{category}
							</label>
						{/each}
					</div>
				</div>

				<div>
					<label
						class="mb-2 block text-xs font-semibold tracking-wide text-zinc-500 uppercase"
						for="brand"
					>
						Brand
					</label>
					<input
						id="brand"
						type="text"
						placeholder="Semua brand"
						bind:value={brand}
						class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
					/>
				</div>

				<div>
					<span class="mb-2 block text-xs font-semibold tracking-wide text-zinc-500 uppercase"
						>Harga</span
					>
					<div class="flex items-center gap-2">
						<input
							type="number"
							placeholder="Min"
							bind:value={minPrice}
							class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
						/>
						<span class="text-zinc-300">–</span>
						<input
							type="number"
							placeholder="Max"
							bind:value={maxPrice}
							class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<button
						type="submit"
						class="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
					>
						Terapkan
					</button>
					{#if hasActiveFilters}
						<button
							type="button"
							onclick={clearFilters}
							class="w-full rounded-md px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100"
						>
							Reset Filter
						</button>
					{/if}
				</div>
			</form>
		</aside>

		<div class="min-w-0 flex-1">
			{#if data.products.data.length === 0}
				<div
					class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-200 py-16 text-center"
				>
					<p class="font-medium text-zinc-600">Tidak ada produk ditemukan</p>
					<p class="text-sm text-zinc-500">Coba ubah atau reset filter yang sedang aktif.</p>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
					{#each data.products.data as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>

				{#if data.products.meta.last_page > 1}
					<div class="mt-8 flex items-center justify-center gap-1">
						{#each Array.from({ length: data.products.meta.last_page }, (_, i) => i + 1) as pageNumber (pageNumber)}
							<button
								onclick={() => goToPage(pageNumber)}
								class="h-8 w-8 rounded-md text-sm {data.products.meta.current_page === pageNumber
									? 'bg-zinc-900 text-white'
									: 'text-zinc-600 hover:bg-zinc-100'}"
							>
								{pageNumber}
							</button>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
