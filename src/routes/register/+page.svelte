<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PathnameWithSearchOrHash } from '$app/types';
	import { register } from '$lib/api/auth';
	import { ApiError } from '$lib/api/client';
	import { safeRedirectTarget } from '$lib/safe-redirect';
	import { auth } from '$lib/stores/auth.svelte';

	let redirectParam = $derived(page.url.searchParams.get('redirect'));
	let loginHref = $derived(
		(redirectParam
			? `/login?redirect=${encodeURIComponent(redirectParam)}`
			: '/login') as PathnameWithSearchOrHash
	);

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let password = $state('');
	let passwordConfirmation = $state('');
	let submitting = $state(false);
	let errorMessage = $state('');

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		submitting = true;

		try {
			const { customer, token } = await register({
				name,
				email,
				phone: phone || undefined,
				password,
				password_confirmation: passwordConfirmation
			});
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
	<title>Daftar — Mr. Twin</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-12">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Daftar Akun</h1>

	{#if errorMessage}
		<div class="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-4">
		<div>
			<label for="name" class="mb-1 block text-sm font-medium text-gray-700">Nama</label>
			<input
				id="name"
				type="text"
				required
				bind:value={name}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
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
			<label for="phone" class="mb-1 block text-sm font-medium text-gray-700"
				>No. Telepon (opsional)</label
			>
			<input
				id="phone"
				type="text"
				bind:value={phone}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
			<input
				id="password"
				type="password"
				required
				minlength="8"
				bind:value={password}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<div>
			<label for="password_confirmation" class="mb-1 block text-sm font-medium text-gray-700">
				Konfirmasi Password
			</label>
			<input
				id="password_confirmation"
				type="password"
				required
				bind:value={passwordConfirmation}
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
		>
			{submitting ? 'Memproses...' : 'Daftar'}
		</button>
	</form>

	<p class="mt-4 text-sm text-gray-500">
		Sudah punya akun?
		<a href={resolve(loginHref)} class="underline">Login</a>
	</p>
</div>
