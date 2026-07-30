<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { formatPrice } from '$lib/format';
	import { auth } from '$lib/stores/auth.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	function proceedToCheckout() {
		if (!auth.isLoggedIn) {
			goto(resolve('/login?redirect=/checkout'));
			return;
		}
		goto(resolve('/checkout'));
	}
</script>

<svelte:head>
	<title>Keranjang — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Keranjang Belanja</h1>

	{#if cart.items.length === 0}
		<p class="text-gray-500">
			Keranjang kosong. <a href={resolve('/')} class="underline">Lihat katalog</a>
		</p>
	{:else}
		<div class="space-y-3">
			{#each cart.items as item (item.productId)}
				<div class="flex items-center justify-between rounded border border-gray-200 p-4">
					<div>
						<p class="text-sm font-medium text-gray-900">{item.name}</p>
						<p class="text-sm text-gray-500">{formatPrice(item.price)}</p>
					</div>
					<div class="flex items-center gap-3">
						<input
							type="number"
							min="1"
							value={item.quantity}
							onchange={(e) => cart.updateQuantity(item.productId, Number(e.currentTarget.value))}
							class="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
						/>
						<button
							onclick={() => cart.remove(item.productId)}
							class="text-sm text-red-500 hover:underline"
						>
							Hapus
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
			<span class="text-lg font-semibold text-gray-900">Total: {formatPrice(cart.total)}</span>
			<button
				onclick={proceedToCheckout}
				class="rounded bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
			>
				Checkout
			</button>
		</div>
	{/if}
</div>
