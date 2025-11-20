<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchNotifications, type Notification } from '$lib/api';
  import { toast } from '$lib/toast-store';
  import Header from '$lib/components/header.svelte';
  import Skeleton from '$lib/components/skeleton.svelte';

  let notifications = $state([]);
  let loading = $state(false);
  let title = $state('');
  let message = $state('');
  let target = $state('all-users');

  onMount(async () => {
    loading = true;
    notifications = await fetchNotifications();
    loading = false;
  });

  function handleSend() {
    if (!title || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(`Notification scheduled for ${target}`);
    title = '';
    message = '';
  }
</script>

<div class="flex-1">
  <Header title="Push Notifications" description="Send and manage push notifications" />

  <div class="p-8 space-y-8">
    <!-- Create Notification Form -->
    <div class="bg-white rounded-lg border border-border p-6">
      <h2 class="text-lg font-bold text-foreground mb-4">Create New Notification</h2>
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-foreground mb-2">Title</label>
          <input
            id="title"
            type="text"
            bind:value={title}
            placeholder="Notification title"
            class="w-full px-4 py-2 border border-border rounded-md text-sm"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            id="message"
            bind:value={message}
            placeholder="Notification message"
            rows={4}
            class="w-full px-4 py-2 border border-border rounded-md text-sm"
          ></textarea>
        </div>
        <div>
          <label for="target" class="block text-sm font-medium text-foreground mb-2">Target Audience</label>
          <select id="target" bind:value={target} class="w-full px-4 py-2 border border-border rounded-md text-sm">
            <option value="all-users">All Users</option>
            <option value="all-groups">All Groups</option>
            <option value="specific-user">Specific User(s)</option>
            <option value="specific-group">Specific Group(s)</option>
          </select>
        </div>
        <button
          onclick={handleSend}
          class="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90"
        >
          Schedule Notification
        </button>
      </div>
    </div>

    <!-- Notification History -->
    <div>
      <h2 class="text-lg font-bold text-foreground mb-4">Sent Notifications</h2>
      <div class="rounded-lg border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-secondary">
            <tr>
              <th class="px-6 py-3 text-left font-semibold">Title</th>
              <th class="px-6 py-3 text-left font-semibold">Audience</th>
              <th class="px-6 py-3 text-left font-semibold">Date Sent</th>
              <th class="px-6 py-3 text-left font-semibold">Status</th>
              <th class="px-6 py-3 text-left font-semibold">Open Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#if loading}
              {#each Array(3) as _}
                <tr class="bg-white">
                  <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                </tr>
              {/each}
            {:else if notifications.length > 0}
              {#each notifications as notif (notif.id)}
                <tr class="bg-white hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-foreground">{notif.title}</td>
                  <td class="px-6 py-4 text-muted-foreground">{notif.audience}</td>
                  <td class="px-6 py-4 text-muted-foreground">{notif.dateSent}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{notif.deliveryStatus}</span>
                  </td>
                  <td class="px-6 py-4 text-foreground">{notif.openRate}%</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
