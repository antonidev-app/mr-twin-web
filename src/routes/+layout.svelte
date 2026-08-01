<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { navigating } from '$app/state';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import ToastStack from '$lib/components/ToastStack.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	let { children } = $props();

	let searchQuery = $state('');

	function handleLogout() {
		auth.clear();
		goto(resolve('/'));
	}

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		const target = (
			searchQuery ? `/?q=${encodeURIComponent(searchQuery)}` : '/'
		) as PathnameWithSearchOrHash;
		goto(resolve(target));
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:ring-2 focus:ring-accent-400 focus:outline-none"
>
	Langsung ke konten utama
</a>

{#if navigating.to}
	<div class="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-accent-100">
		<div class="h-full w-1/3 animate-[loading-bar_1s_ease-in-out_infinite] bg-accent-500"></div>
	</div>
{/if}

<div class="flex min-h-screen flex-col bg-zinc-50">
	<header class="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
			<a href={resolve('/')} class="flex shrink-0 items-center gap-2">
				<span
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold tracking-tight text-white"
				>
					MT
				</span>
				<span class="text-lg font-semibold tracking-tight text-zinc-900">Mr. Twin</span>
			</a>

			<form onsubmit={handleSearch} class="order-last w-full sm:order-0 sm:w-auto sm:flex-1">
				<label for="header-search" class="sr-only">Cari produk</label>
				<div class="relative">
					<svg
						viewBox="0 0 20 20"
						fill="currentColor"
						class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
					>
						<path
							fill-rule="evenodd"
							d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
							clip-rule="evenodd"
						/>
					</svg>
					<input
						id="header-search"
						type="search"
						placeholder="Cari produk..."
						bind:value={searchQuery}
						class="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-4 pl-9 text-sm transition focus:border-accent-500 focus:bg-white focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
					/>
				</div>
			</form>

			<nav class="flex shrink-0 items-center gap-1 text-sm">
				<a
					href={resolve('/cart')}
					aria-label="Keranjang"
					class="relative flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98]"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.802-4.638 2.032-7.006A1.9 1.9 0 0 0 19.5 5.25H5.106M7.5 14.25 5.106 5.25M17.25 20.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm-9 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
						/>
					</svg>
					<span class="hidden md:inline">Keranjang</span>
					{#if cart.itemCount > 0}
						<span
							class="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-semibold text-zinc-900"
						>
							{cart.itemCount}
						</span>
					{/if}
				</a>
				{#if auth.isLoggedIn}
					<a
						href={resolve('/orders')}
						class="rounded-lg px-3 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98]"
					>
						Pesanan
					</a>
					<button
						onclick={handleLogout}
						class="rounded-lg px-3 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98]"
					>
						Logout
					</button>
				{:else}
					<a
						href={resolve('/login')}
						class="rounded-lg px-3 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98]"
					>
						Login
					</a>
					<a
						href={resolve('/register')}
						class="rounded-lg bg-accent-400 px-3 py-2 font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98]"
					>
						Daftar
					</a>
				{/if}
			</nav>
		</div>
	</header>

	<main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
		{@render children()}
	</main>

	<footer class="border-t border-zinc-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 text-xs text-zinc-500">
			Mr. Twin — proyek portofolio, katalog disinkron dari data toko IT sungguhan (read-only). Lihat
			kode di
			<a
				href="https://github.com/antonidev-app"
				target="_blank"
				rel="noopener noreferrer"
				class="font-medium text-accent-700 underline-offset-2 hover:underline"
			>
				GitHub
			</a>.
		</div>
	</footer>
</div>

<ToastStack />
