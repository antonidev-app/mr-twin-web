<script lang="ts">
	import './layout.css';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	let { children } = $props();

	function handleLogout() {
		auth.clear();
		goto(resolve('/'));
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="border-b border-gray-200">
	<nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
		<a href={resolve('/')} class="text-lg font-bold text-gray-900">Mr. Twin</a>
		<div class="flex items-center gap-4 text-sm">
			<a href={resolve('/cart')} class="text-gray-700 hover:underline"
				>Keranjang ({cart.itemCount})</a
			>
			{#if auth.isLoggedIn}
				<a href={resolve('/orders')} class="text-gray-700 hover:underline">Pesanan Saya</a>
				<button onclick={handleLogout} class="text-gray-700 hover:underline">Logout</button>
			{:else}
				<a href={resolve('/login')} class="text-gray-700 hover:underline">Login</a>
				<a href={resolve('/register')} class="text-gray-700 hover:underline">Daftar</a>
			{/if}
		</div>
	</nav>
</header>

{@render children()}
