<script lang="ts">
	let {
		src,
		alt,
		class: className = ''
	}: { src?: string | null; alt: string; class?: string } = $props();

	let failed = $state(false);
</script>

{#if src && !failed}
	<img {src} {alt} loading="lazy" class={className} onerror={() => (failed = true)} />
{:else}
	<div class={`flex items-center justify-center bg-zinc-100 ${className}`}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			class="h-1/3 w-1/3 text-zinc-300"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<circle cx="8.5" cy="8.5" r="1.5" />
			<path d="m21 15-5-5L5 21" />
		</svg>
	</div>
{/if}
