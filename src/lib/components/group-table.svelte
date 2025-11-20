<script lang="ts">
  import { toast } from '$lib/toast-store';
  import type { Group } from '$lib/api';
  import Skeleton from './skeleton.svelte';

  let { groups = [], loading = false, page = 1, totalPages = 1, onPageChange = (p: number) => {} } = $props();

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      restricted: 'bg-yellow-100 text-yellow-700',
      banned: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }
</script>

<div class="rounded-lg border border-border overflow-hidden">
  <table class="w-full text-sm">
    <thead class="bg-secondary">
      <tr>
        <th class="px-6 py-3 text-left font-semibold">Group Name</th>
        <th class="px-6 py-3 text-left font-semibold">Type</th>
        <th class="px-6 py-3 text-left font-semibold">Members</th>
        <th class="px-6 py-3 text-left font-semibold">Status</th>
        <th class="px-6 py-3 text-left font-semibold">Verified</th>
        <th class="px-6 py-3 text-left font-semibold">Created</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border">
      {#if loading}
        {#each Array(5) as _}
          <tr class="bg-white">
            <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
          </tr>
        {/each}
      {:else if groups.length > 0}
        {#each groups as group (group.id)}
          <tr class="bg-white hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-foreground">{group.name}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">{group.type}</span>
            </td>
            <td class="px-6 py-4 text-muted-foreground">{group.membersCount}</td>
            <td class="px-6 py-4">
              <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
                {group.status}
              </span>
            </td>
            <td class="px-6 py-4">
              {#if group.verified}
                <span class="text-green-600 font-medium">✓</span>
              {:else}
                <span class="text-gray-400">✗</span>
              {/if}
            </td>
            <td class="px-6 py-4 text-muted-foreground">{group.createdDate}</td>
          </tr>
        {/each}
      {:else}
        <tr class="bg-white">
          <td colspan="6" class="px-6 py-4 text-center text-muted-foreground">No groups found</td>
        </tr>
      {/if}
    </tbody>
  </table>

  {#if totalPages > 1}
    <div class="bg-secondary px-6 py-4 flex items-center justify-between">
      <div class="text-xs text-muted-foreground">Page {page} of {totalPages}</div>
      <div class="flex gap-2">
        <button
          onclick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          class="px-3 py-1 rounded border border-border disabled:opacity-50 text-xs hover:bg-background"
        >
          Previous
        </button>
        <button
          onclick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          class="px-3 py-1 rounded border border-border disabled:opacity-50 text-xs hover:bg-background"
        >
          Next
        </button>
      </div>
    </div>
  {/if}
</div>
