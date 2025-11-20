<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchTickets } from '$lib/api';
  import Header from '$lib/components/header.svelte';
  import Skeleton from '$lib/components/skeleton.svelte';
  import type { SupportTicket } from '$lib/api';

  let tickets = $state<SupportTicket[]>([]);
  let loading = $state(false);

  onMount(async () => {
    loading = true;
    tickets = await fetchTickets();
    loading = false;
  });

  function getPriorityColor(priority: string) {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      open: 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-orange-100 text-orange-700',
      resolved: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  }
</script>

<div class="flex-1">
  <Header title="Support Tickets" description="Manage user support requests and issues" />

  <div class="p-8 space-y-6">
    <div class="rounded-lg border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-secondary">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Ticket ID</th>
            <th class="px-6 py-3 text-left font-semibold">User</th>
            <th class="px-6 py-3 text-left font-semibold">Category</th>
            <th class="px-6 py-3 text-left font-semibold">Priority</th>
            <th class="px-6 py-3 text-left font-semibold">Status</th>
            <th class="px-6 py-3 text-left font-semibold">Created</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#if loading}
            {#each Array(5) as _}
              <tr class="bg-white">
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
              </tr>
            {/each}
          {:else if tickets.length > 0}
            {#each tickets as ticket (ticket.id)}
              <tr class="bg-white hover:bg-gray-50 cursor-pointer">
                <td class="px-6 py-4 font-medium text-primary">{ticket.ticketId}</td>
                <td class="px-6 py-4 text-foreground">{ticket.username}</td>
                <td class="px-6 py-4 text-muted-foreground">{ticket.category}</td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-muted-foreground">{ticket.createdAt}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
