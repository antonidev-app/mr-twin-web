<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { listOrders } from '$lib/api/orders';
	import type { Order } from '$lib/api/types';
	import { formatPrice, orderStatusClass } from '$lib/format';
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

<div class="mx-auto max-w-2xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-bold tracking-tight text-zinc-900">Pesanan Saya</h1>

	{#if loading}
		<div class="space-y-3">
			{#each Array(3) as _, i (i)}
				<div class="h-20 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50"></div>
			{/each}
		</div>
	{:else if orders.length === 0}
		<div
			class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-200 py-16 text-center"
		>
			<p class="font-medium text-zinc-600">Belum ada pesanan</p>
			<a
				href={resolve('/')}
				class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
			>
				Belanja Sekarang
			</a>
		</div>
	{:else}
		<div class="space-y-3">
			{#each orders as order (order.id)}
				<a
					href={resolve('/orders/[id]', { id: String(order.id) })}
					class="flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition hover:shadow-sm"
				>
					<div>
						<p class="text-sm font-medium text-zinc-900">{order.order_number}</p>
						<p class="text-xs text-zinc-400">
							{new Date(order.created_at).toLocaleString('id-ID')}
						</p>
					</div>
					<div class="text-right">
						<p class="mb-1 text-sm font-semibold text-zinc-900">
							{formatPrice(order.total_amount)}
						</p>
						<span
							class="rounded-full px-2 py-0.5 text-xs font-medium capitalize {orderStatusClass(
								order.status
							)}"
						>
							{order.status}
						</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
