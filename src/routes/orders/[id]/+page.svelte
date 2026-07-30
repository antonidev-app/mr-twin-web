<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { onMount } from 'svelte';
	import { getOrder } from '$lib/api/orders';
	import type { Order } from '$lib/api/types';
	import { formatPrice } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';

	let order = $state<Order | null>(null);
	let loading = $state(true);
	let notFound = $state(false);

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto(resolve(`/login?redirect=/orders/${page.params.id}` as PathnameWithSearchOrHash));
			return;
		}
		try {
			const result = await getOrder(page.params.id!, auth.token!);
			order = result.data;
		} catch {
			notFound = true;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Detail Pesanan — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-8">
	<a href={resolve('/orders')} class="mb-4 inline-block text-sm text-gray-500 hover:underline"
		>&larr; Pesanan Saya</a
	>

	{#if loading}
		<p class="text-gray-500">Memuat...</p>
	{:else if notFound || !order}
		<p class="text-gray-500">Pesanan tidak ditemukan.</p>
	{:else}
		<div class="rounded border border-gray-200 p-6">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<h1 class="text-lg font-bold text-gray-900">{order.order_number}</h1>
					<p class="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('id-ID')}</p>
				</div>
				<span
					class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 capitalize"
				>
					{order.status}
				</span>
			</div>

			<div class="mb-4 border-t border-gray-200 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-gray-700">Item Pesanan</h2>
				{#each order.items as item (item.sku)}
					<div class="flex justify-between py-1 text-sm text-gray-600">
						<span>{item.item_name} × {item.quantity}</span>
						<span>{formatPrice(item.subtotal)}</span>
					</div>
				{/each}
				<div
					class="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900"
				>
					<span>Total</span>
					<span>{formatPrice(order.total_amount)}</span>
				</div>
			</div>

			<div class="border-t border-gray-200 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-gray-700">Pengiriman</h2>
				<p class="text-sm text-gray-600">{order.shipping_name}</p>
				<p class="text-sm text-gray-600">{order.shipping_phone}</p>
				<p class="text-sm text-gray-600">{order.shipping_address}</p>
			</div>
		</div>
	{/if}
</div>
