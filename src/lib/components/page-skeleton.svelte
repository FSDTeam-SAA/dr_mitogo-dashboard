<script lang="ts">
  let { count = 5 } = $props();
  import Skeleton from './skeleton.svelte';
</script>

<div class="space-y-4">
  {#each Array(count) as _}
    <div class="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div class="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  {/each}
</div>
