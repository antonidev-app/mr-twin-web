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

<div class="mx-auto max-w-sm px-4 py-12">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Login</h1>

	{#if errorMessage}
		<div class="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-4">
		<div>
			<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
			<input
				id="email"
				type="email"
				required
				bind:value={email}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
			<input
				id="password"
				type="password"
				required
				bind:value={password}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
		>
			{submitting ? 'Memproses...' : 'Login'}
		</button>
	</form>

	<p class="mt-4 text-sm text-gray-500">
		Belum punya akun?
		<a href={resolve(registerHref)} class="underline">Daftar</a>
	</p>
</div>
