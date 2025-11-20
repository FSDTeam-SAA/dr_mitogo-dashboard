<script lang="ts">
  interface Props {
    title?: string;
    description?: string;
  }

  let { title = 'Dashboard', description = '' }: Props = $props();
</script>

<div class="bg-gradient-to-r from-red-50 to-white border-b border-border p-6">
  <h1 class="text-3xl font-bold text-foreground mb-2">{title}</h1>
  {#if description}
    <p class="text-muted-foreground">{description}</p>
  {/if}
</div>
