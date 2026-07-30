<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { listOrders } from '$lib/api/orders';
	import type { Order } from '$lib/api/types';
	import { formatPrice } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';

	let orders = $state<Order[]>([]);
	let loading = $state(true);

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto(resolve('/login?redirect=/orders'));
			return;
		}
		const result = await listOrders(auth.token!);
		orders = result.data;
		loading = false;
	});
</script>

<svelte:head>
	<title>Pesanan Saya — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Pesanan Saya</h1>

	{#if loading}
		<p class="text-gray-500">Memuat...</p>
	{:else if orders.length === 0}
		<p class="text-gray-500">
			Belum ada pesanan. <a href={resolve('/')} class="underline">Belanja sekarang</a>
		</p>
	{:else}
		<div class="space-y-3">
			{#each orders as order (order.id)}
				<a
					href={resolve('/orders/[id]', { id: String(order.id) })}
					class="flex items-center justify-between rounded border border-gray-200 p-4 hover:shadow-sm"
				>
					<div>
						<p class="text-sm font-medium text-gray-900">{order.order_number}</p>
						<p class="text-xs text-gray-400">
							{new Date(order.created_at).toLocaleString('id-ID')}
						</p>
					</div>
					<div class="text-right">
						<p class="text-sm font-semibold text-gray-900">{formatPrice(order.total_amount)}</p>
						<p class="text-xs text-gray-500 capitalize">{order.status}</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
