<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { ApiError } from '$lib/api/client';
	import { checkout } from '$lib/api/orders';
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

<div class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

	<div class="mb-6 rounded border border-gray-200 p-4">
		<h2 class="mb-3 text-sm font-semibold text-gray-700">Ringkasan Pesanan</h2>
		{#each cart.items as item (item.productId)}
			<div class="flex justify-between py-1 text-sm text-gray-600">
				<span>{item.name} × {item.quantity}</span>
				<span>{formatPrice(item.price * item.quantity)}</span>
			</div>
		{/each}
		<div
			class="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900"
		>
			<span>Total</span>
			<span>{formatPrice(cart.total)}</span>
		</div>
	</div>

	{#if errorMessage}
		<div class="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-4">
		<div>
			<label for="shipping_name" class="mb-1 block text-sm font-medium text-gray-700"
				>Nama Penerima</label
			>
			<input
				id="shipping_name"
				type="text"
				required
				bind:value={shippingName}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<div>
			<label for="shipping_phone" class="mb-1 block text-sm font-medium text-gray-700"
				>No. Telepon</label
			>
			<input
				id="shipping_phone"
				type="text"
				required
				bind:value={shippingPhone}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<div>
			<label for="shipping_address" class="mb-1 block text-sm font-medium text-gray-700"
				>Alamat Pengiriman</label
			>
			<textarea
				id="shipping_address"
				required
				rows="3"
				bind:value={shippingAddress}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"></textarea>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
		>
			{submitting ? 'Memproses...' : 'Buat Pesanan'}
		</button>
	</form>
</div>
