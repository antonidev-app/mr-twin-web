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

<div class="border-b border-zinc-200 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-5">
		<p class="mb-1 text-xs font-medium tracking-wide text-accent-700">
			Toko IT · Stok langsung dari gudang
		</p>
		<h1 class="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Katalog Produk</h1>
		<p class="mt-1 text-sm text-zinc-500">{data.products.meta.total} produk tersedia</p>
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-6">
	<div class="flex flex-col gap-6 lg:flex-row">
		<aside class="shrink-0 lg:w-48">
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
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
					/>
				</div>

				<div>
					<span class="mb-2 block text-xs font-semibold tracking-wide text-zinc-500 uppercase"
						>Kategori</span
					>
					<div class="space-y-1.5">
						<label class="flex items-center gap-2 text-sm text-zinc-700">
							<input type="radio" bind:group={displayCategory} value="" class="accent-accent-600" />
							Semua Kategori
						</label>
						{#each data.categories as category (category)}
							<label class="flex items-center gap-2 text-sm text-zinc-700">
								<input
									type="radio"
									bind:group={displayCategory}
									value={category}
									class="accent-accent-600"
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
						class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
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
							class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
						/>
						<span class="text-zinc-300">–</span>
						<input
							type="number"
							placeholder="Max"
							bind:value={maxPrice}
							class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<button
						type="submit"
						class="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-[0.98]"
					>
						Terapkan
					</button>
					{#if hasActiveFilters}
						<button
							type="button"
							onclick={clearFilters}
							class="w-full rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 active:scale-[0.98]"
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
					class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-white py-16 text-center"
				>
					<p class="font-medium text-zinc-600">Tidak ada produk ditemukan</p>
					<p class="text-sm text-zinc-500">Coba ubah atau reset filter yang sedang aktif.</p>
				</div>
			{:else}
				<div
					class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
				>
					{#each data.products.data as product, i (product.id)}
						<div
							class="motion-safe:animate-[fade-in-up_0.4s_ease-out_backwards]"
							style="animation-delay: {Math.min(i, 8) * 40}ms"
						>
							<ProductCard {product} />
						</div>
					{/each}
				</div>

				{#if data.products.meta.last_page > 1}
					<div class="mt-8 flex items-center justify-center gap-1">
						<button
							onclick={() => goToPage(data.products.meta.current_page - 1)}
							disabled={data.products.meta.current_page <= 1}
							aria-label="Halaman sebelumnya"
							class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30"
						>
							<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
								<path
									fill-rule="evenodd"
									d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
						{#each Array.from({ length: data.products.meta.last_page }, (_, i) => i + 1) as pageNumber (pageNumber)}
							<button
								onclick={() => goToPage(pageNumber)}
								class="h-8 w-8 rounded-lg text-sm font-medium transition active:scale-[0.98] {data
									.products.meta.current_page === pageNumber
									? 'bg-zinc-900 text-white'
									: 'text-zinc-600 hover:bg-zinc-100'}"
							>
								{pageNumber}
							</button>
						{/each}
						<button
							onclick={() => goToPage(data.products.meta.current_page + 1)}
							disabled={data.products.meta.current_page >= data.products.meta.last_page}
							aria-label="Halaman berikutnya"
							class="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30"
						>
							<svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
								<path
									fill-rule="evenodd"
									d="M7.21 14.77a.75.75 0 0 1 0-1.06L10.94 10 7.21 6.29a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0Z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
