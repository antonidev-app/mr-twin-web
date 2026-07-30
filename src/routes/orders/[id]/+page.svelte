<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { onMount } from 'svelte';
	import { getOrder } from '$lib/api/orders';
	import type { Order } from '$lib/api/types';
	import { formatPrice, orderStatusClass } from '$lib/format';
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

<div class="mx-auto max-w-2xl px-4 py-6">
	<a
		href={resolve('/orders')}
		class="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
	>
		&larr; Pesanan Saya
	</a>

	{#if loading}
		<div class="h-56 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50"></div>
	{:else if notFound || !order}
		<div class="rounded-xl border border-dashed border-zinc-200 py-16 text-center text-zinc-500">
			Pesanan tidak ditemukan.
		</div>
	{:else}
		<div class="rounded-xl border border-zinc-200 p-6">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h1 class="text-lg font-bold text-zinc-900">{order.order_number}</h1>
					<p class="text-xs text-zinc-400">{new Date(order.created_at).toLocaleString('id-ID')}</p>
				</div>
				<span
					class="rounded-full px-3 py-1 text-xs font-medium capitalize {orderStatusClass(
						order.status
					)}"
				>
					{order.status}
				</span>
			</div>

			<div class="mb-4 border-t border-zinc-100 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-zinc-700">Item Pesanan</h2>
				{#each order.items as item (item.sku)}
					<div class="flex justify-between py-1 text-sm text-zinc-600">
						<span>{item.item_name} × {item.quantity}</span>
						<span>{formatPrice(item.subtotal)}</span>
					</div>
				{/each}
				<div
					class="mt-2 flex justify-between border-t border-zinc-100 pt-2 text-sm font-semibold text-zinc-900"
				>
					<span>Total</span>
					<span>{formatPrice(order.total_amount)}</span>
				</div>
			</div>

			<div class="border-t border-zinc-100 pt-4">
				<h2 class="mb-2 text-sm font-semibold text-zinc-700">Pengiriman</h2>
				<p class="text-sm text-zinc-600">{order.shipping_name}</p>
				<p class="text-sm text-zinc-600">{order.shipping_phone}</p>
				<p class="text-sm text-zinc-600">{order.shipping_address}</p>
			</div>
		</div>
	{/if}
</div>
