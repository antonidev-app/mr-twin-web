<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { slide } from 'svelte/transition';
	import ProductImage from '$lib/components/ProductImage.svelte';
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

<div class="mx-auto max-w-7xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">Keranjang Belanja</h1>

	{#if cart.items.length === 0}
		<div
			class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-white py-16 text-center"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				class="h-12 w-12 text-zinc-300"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.802-4.638 2.032-7.006A1.9 1.9 0 0 0 19.5 5.25H5.106M7.5 14.25 5.106 5.25"
				/>
			</svg>
			<p class="font-medium text-zinc-600">Keranjang kamu masih kosong</p>
			<a
				href={resolve('/')}
				class="rounded-lg bg-accent-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98]"
			>
				Lihat Katalog
			</a>
		</div>
	{:else}
		<div class="flex flex-col gap-6 md:flex-row">
			<div class="flex-1 space-y-3">
				{#each cart.items as item (item.productId)}
					<div
						transition:slide|local={{ duration: 200 }}
						class="flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 sm:flex-nowrap sm:gap-4"
					>
						<div class="flex min-w-50 flex-1 items-center gap-3">
							<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
								<ProductImage src={item.image} alt={item.name} class="h-full w-full object-cover" />
							</div>
							<div class="min-w-0 flex-1">
								<a
									href={resolve('/products/[id]', { id: String(item.productId) })}
									class="line-clamp-1 text-sm font-medium text-zinc-800 hover:underline"
								>
									{item.name}
								</a>
								<p class="font-mono text-sm text-zinc-500 tabular-nums">
									{formatPrice(item.price)}
								</p>
							</div>
						</div>

						<div class="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-normal">
							<div class="flex items-center rounded-lg border border-zinc-200">
								<button
									type="button"
									onclick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
									class="px-2.5 py-1.5 text-zinc-500 transition hover:bg-zinc-50 active:scale-[0.98]"
									aria-label="Kurangi jumlah"
								>
									−
								</button>
								<span class="w-8 text-center text-sm">{item.quantity}</span>
								<button
									type="button"
									onclick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
									class="px-2.5 py-1.5 text-zinc-500 transition hover:bg-zinc-50 active:scale-[0.98]"
									aria-label="Tambah jumlah"
								>
									+
								</button>
							</div>
							<p
								class="w-24 shrink-0 text-right font-mono text-sm font-semibold text-zinc-900 tabular-nums"
							>
								{formatPrice(item.price * item.quantity)}
							</p>
							<button
								onclick={() => cart.remove(item.productId)}
								class="shrink-0 rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-500 active:scale-[0.98]"
								aria-label="Hapus dari keranjang"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
									class="h-4 w-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
									/>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="h-fit rounded-lg bg-white p-5 md:w-72">
				<h2 class="mb-4 text-sm font-semibold text-zinc-700">Ringkasan Belanja</h2>
				<div class="flex justify-between border-b border-zinc-100 pb-3 text-sm text-zinc-500">
					<span>Subtotal ({cart.itemCount} barang)</span>
					<span class="font-mono tabular-nums">{formatPrice(cart.total)}</span>
				</div>
				<div class="flex justify-between py-3 text-base font-semibold text-zinc-900">
					<span>Total</span>
					<span class="font-mono tabular-nums">{formatPrice(cart.total)}</span>
				</div>
				<button
					onclick={proceedToCheckout}
					class="mt-2 w-full rounded-lg bg-accent-400 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-accent-300 active:scale-[0.98]"
				>
					Checkout
				</button>
			</div>
		</div>
	{/if}
</div>
