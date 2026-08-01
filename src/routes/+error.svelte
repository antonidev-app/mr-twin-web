<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status} — Mr. Twin</title>
</svelte:head>

<div
	class="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center"
>
	<p class="mb-2 text-6xl font-bold text-zinc-200">{page.status}</p>
	<h1 class="mb-2 text-lg font-semibold text-zinc-900">
		{page.error?.message || 'Terjadi kesalahan yang tidak terduga.'}
	</h1>
	<p class="mb-6 text-sm text-zinc-500">
		{#if page.status === 404}
			Halaman atau produk yang kamu cari tidak ditemukan.
		{:else}
			Coba muat ulang halaman, atau kembali beberapa saat lagi.
		{/if}
	</p>
	<a
		href={resolve('/')}
		class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
	>
		Kembali ke Katalog
	</a>
</div>
