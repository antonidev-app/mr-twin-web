<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { login } from '$lib/api/auth';
	import { ApiError } from '$lib/api/client';
	import { safeRedirectTarget } from '$lib/safe-redirect';
	import { auth } from '$lib/stores/auth.svelte';

	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let errorMessage = $state('');

	let redirectParam = $derived(page.url.searchParams.get('redirect'));
	let registerHref = $derived(
		(redirectParam
			? `/register?redirect=${encodeURIComponent(redirectParam)}`
			: '/register') as PathnameWithSearchOrHash
	);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		submitting = true;

		try {
			const { customer, token } = await login({ email, password });
			auth.setSession(token, customer);
			goto(resolve(safeRedirectTarget(redirectParam)));
		} catch (err) {
			errorMessage = err instanceof ApiError ? err.message : 'Terjadi kesalahan. Coba lagi.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Login — Mr. Twin</title>
</svelte:head>

<div class="mx-auto flex min-h-[calc(100vh-8rem)] max-w-sm flex-col justify-center px-4 py-12">
	<h1 class="mb-1 text-2xl font-bold tracking-tight text-zinc-900">Selamat datang kembali</h1>
	<p class="mb-6 text-sm text-zinc-500">Masuk untuk lanjut belanja & cek pesanan kamu.</p>

	{#if errorMessage}
		<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-4">
		<div>
			<label for="email" class="mb-1 block text-sm font-medium text-zinc-700">Email</label>
			<input
				id="email"
				type="email"
				required
				bind:value={email}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-zinc-700">Password</label>
			<input
				id="password"
				type="password"
				required
				bind:value={password}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
		>
			{submitting ? 'Memproses...' : 'Login'}
		</button>
	</form>

	<p class="mt-6 text-center text-sm text-zinc-500">
		Belum punya akun?
		<a href={resolve(registerHref)} class="font-medium text-blue-600 hover:underline">Daftar</a>
	</p>
</div>
