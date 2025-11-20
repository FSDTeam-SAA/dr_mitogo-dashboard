<script lang="ts">
  import { toast } from '$lib/toast-store';
  import type { User } from '$lib/api';
  import Skeleton from './skeleton.svelte';

  let { users = [], loading = false, page = 1, totalPages = 1, onPageChange = (p: number) => {} } = $props();

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      online: 'bg-green-100 text-green-700',
      offline: 'bg-gray-100 text-gray-700',
      banned: 'bg-red-100 text-red-700',
      restricted: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }

  function handleAction(action: string, username: string) {
    toast.success(`${action} for ${username}`);
  }
</script>

<div class="rounded-lg border border-border overflow-hidden">
  <table class="w-full text-sm">
    <thead class="bg-secondary">
      <tr>
        <th class="px-6 py-3 text-left font-semibold">User</th>
        <th class="px-6 py-3 text-left font-semibold">Email</th>
        <th class="px-6 py-3 text-left font-semibold">Status</th>
        <th class="px-6 py-3 text-left font-semibold">Verified</th>
        <th class="px-6 py-3 text-left font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border">
      {#if loading}
        {#each Array(5) as _}
          <tr class="bg-white">
            <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
            <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
          </tr>
        {/each}
      {:else if users.length > 0}
        {#each users as user (user.id)}
          <tr class="bg-white hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img src={user.avatar || "/placeholder.svg"} alt={user.username} class="h-8 w-8 rounded-full" />
                <div>
                  <p class="font-medium text-foreground">{user.username}</p>
                  <p class="text-xs text-muted-foreground">{user.displayName}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-muted-foreground">{user.email}</td>
            <td class="px-6 py-4">
              <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </td>
            <td class="px-6 py-4">
              {#if user.verified}
                <span class="text-green-600 font-medium">✓</span>
              {:else}
                <span class="text-gray-400">✗</span>
              {/if}
            </td>
            <td class="px-6 py-4">
              <button
                onclick={() => handleAction('Viewed profile', user.username)}
                class="text-primary hover:underline text-xs font-medium"
              >
                View
              </button>
            </td>
          </tr>
        {/each}
      {:else}
        <tr class="bg-white">
          <td colspan="5" class="px-6 py-4 text-center text-muted-foreground">No users found</td>
        </tr>
      {/if}
    </tbody>
  </table>

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="bg-secondary px-6 py-4 flex items-center justify-between">
      <div class="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </div>
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
