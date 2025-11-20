<script lang="ts">
  import { toast } from '$lib/toast-store';
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
  {#each $toast as toastItem (toastItem.id)}
    <!-- Removed deprecated Svelte 4 transition syntax, using CSS animations -->
    <div
      class={`px-4 py-3 rounded-lg text-sm font-medium shadow-lg toast-notification ${
        toastItem.type === 'success'
          ? 'bg-green-500 text-white'
          : toastItem.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
      }`}
    >
      {toastItem.message}
    </div>
  {/each}
</div>

<style>
  :global(.toast-notification) {
    animation: slideIn 0.3s ease-out forwards;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
