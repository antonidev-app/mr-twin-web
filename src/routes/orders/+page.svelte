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

<div class="mx-auto max-w-7xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">Pesanan Saya</h1>

	{#if loading}
		<div class="space-y-3">
			{#each Array(3) as _, i (i)}
				<div class="h-20 animate-pulse rounded-lg bg-zinc-100"></div>
			{/each}
		</div>
	{:else if orders.length === 0}
		<div
			class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-white py-16 text-center"
		>
			<p class="font-medium text-zinc-600">Belum ada pesanan</p>
			<a
				href={resolve('/')}
				class="rounded-lg bg-accent-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98]"
			>
				Belanja Sekarang
			</a>
		</div>
	{:else}
		<div class="space-y-3">
			{#each orders as order (order.id)}
				<a
					href={resolve('/orders/[id]', { id: String(order.id) })}
					class="flex items-center justify-between rounded-lg bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-900/5"
				>
					<div>
						<p class="font-mono text-sm font-medium text-zinc-900">{order.order_number}</p>
						<p class="text-xs text-zinc-500">
							{new Date(order.created_at).toLocaleString('id-ID')}
						</p>
					</div>
					<div class="text-right">
						<p class="mb-1 font-mono text-sm font-semibold text-zinc-900 tabular-nums">
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
