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

<div class="mx-auto flex max-w-sm flex-col justify-center px-4 py-12">
	<h1 class="mb-1 text-2xl font-bold tracking-tight text-zinc-900">Buat akun baru</h1>
	<p class="mb-6 text-sm text-zinc-500">Daftar sebentar untuk mulai belanja di Mr. Twin.</p>

	{#if errorMessage}
		<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-4">
		<div>
			<label for="name" class="mb-1 block text-sm font-medium text-zinc-700">Nama</label>
			<input
				id="name"
				type="text"
				required
				bind:value={name}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
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
			<label for="phone" class="mb-1 block text-sm font-medium text-zinc-700"
				>No. Telepon (opsional)</label
			>
			<input
				id="phone"
				type="text"
				bind:value={phone}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-zinc-700">Password</label>
			<input
				id="password"
				type="password"
				required
				minlength="8"
				bind:value={password}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="password_confirmation" class="mb-1 block text-sm font-medium text-zinc-700">
				Konfirmasi Password
			</label>
			<input
				id="password_confirmation"
				type="password"
				required
				bind:value={passwordConfirmation}
				class="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
		>
			{submitting ? 'Memproses...' : 'Daftar'}
		</button>
	</form>

	<p class="mt-6 text-center text-sm text-zinc-500">
		Sudah punya akun?
		<a href={resolve(loginHref)} class="font-medium text-blue-600 hover:underline">Login</a>
	</p>
</div>
