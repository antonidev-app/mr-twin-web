<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { ApiError } from '$lib/api/client';
	import { checkout } from '$lib/api/orders';
	import ProductImage from '$lib/components/ProductImage.svelte';
	import { formatPrice } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	let shippingName = $state('');
	let shippingPhone = $state('');
	let shippingAddress = $state('');
	let submitting = $state(false);
	let errorMessage = $state('');

	onMount(() => {
		if (!auth.isLoggedIn) {
			goto(resolve('/login?redirect=/checkout'));
			return;
		}
		if (cart.items.length === 0) {
			goto(resolve('/cart'));
			return;
		}
		shippingName = auth.customer?.name ?? '';
		shippingPhone = auth.customer?.phone ?? '';
	});

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		submitting = true;

		try {
			const { data: order } = await checkout(
				{
					items: cart.items.map((item) => ({
						product_id: item.productId,
						quantity: item.quantity
					})),
					shipping_name: shippingName,
					shipping_phone: shippingPhone,
					shipping_address: shippingAddress
				},
				auth.token!
			);
			cart.clear();
			goto(resolve('/orders/[id]', { id: String(order.id) }));
		} catch (err) {
			errorMessage = err instanceof ApiError ? err.message : 'Terjadi kesalahan. Coba lagi.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Checkout — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">Checkout</h1>

	<div class="flex flex-col gap-6 md:flex-row">
		<form id="checkout-form" onsubmit={submit} class="order-2 flex-1 space-y-4 md:order-1">
			<div class="rounded-lg bg-white p-5">
				<h2 class="mb-4 text-sm font-semibold text-zinc-700">Informasi Pengiriman</h2>

				{#if errorMessage}
					<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
						{errorMessage}
					</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="shipping_name" class="mb-1 block text-sm font-medium text-zinc-700"
							>Nama Penerima</label
						>
						<input
							id="shipping_name"
							type="text"
							required
							bind:value={shippingName}
							class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
						/>
					</div>
					<div>
						<label for="shipping_phone" class="mb-1 block text-sm font-medium text-zinc-700"
							>No. Telepon</label
						>
						<input
							id="shipping_phone"
							type="text"
							required
							bind:value={shippingPhone}
							class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
						/>
					</div>
					<div>
						<label for="shipping_address" class="mb-1 block text-sm font-medium text-zinc-700">
							Alamat Pengiriman
						</label>
						<textarea
							id="shipping_address"
							required
							rows="3"
							bind:value={shippingAddress}
							class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-accent-500 focus:ring-2 focus:ring-accent-400/40 focus:outline-none"
						></textarea>
					</div>
				</div>
			</div>

			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded-lg bg-accent-400 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50 md:hidden"
			>
				{submitting ? 'Memproses...' : 'Buat Pesanan'}
			</button>
		</form>

		<div class="order-1 h-fit rounded-lg bg-white p-5 md:order-2 md:w-80">
			<h2 class="mb-4 text-sm font-semibold text-zinc-700">Ringkasan Pesanan</h2>
			<div class="max-h-64 space-y-3 overflow-y-auto">
				{#each cart.items as item (item.productId)}
					<div class="flex items-center gap-3">
						<div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
							<ProductImage src={item.image} alt={item.name} class="h-full w-full object-cover" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="line-clamp-1 text-sm text-zinc-700">{item.name}</p>
							<p class="font-mono text-xs text-zinc-500 tabular-nums">
								{item.quantity} × {formatPrice(item.price)}
							</p>
						</div>
						<p class="shrink-0 font-mono text-sm font-medium text-zinc-900 tabular-nums">
							{formatPrice(item.price * item.quantity)}
						</p>
					</div>
				{/each}
			</div>
			<div
				class="mt-4 flex justify-between border-t border-zinc-100 pt-4 text-base font-semibold text-zinc-900"
			>
				<span>Total</span>
				<span class="font-mono tabular-nums">{formatPrice(cart.total)}</span>
			</div>
			<button
				type="submit"
				form="checkout-form"
				disabled={submitting}
				class="mt-4 hidden w-full rounded-lg bg-accent-400 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98] disabled:opacity-50 md:block"
			>
				{submitting ? 'Memproses...' : 'Buat Pesanan'}
			</button>
		</div>
	</div>
</div>
