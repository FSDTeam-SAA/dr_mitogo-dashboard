<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchContent } from '$lib/api';
  import { toast } from '$lib/toast-store';
  import Header from '$lib/components/header.svelte';
  import Skeleton from '$lib/components/skeleton.svelte';
  import type { ContentItem } from '$lib/api';

  let content = $state<ContentItem[]>([]);
  let loading = $state(false);
  let filterTab = $state('all');

  onMount(async () => {
    loading = true;
    content = await fetchContent();
    loading = false;
  });

  function handleDelete(id: string) {
    toast.success('Content deleted');
  }

  function handleBanUser(author: string) {
    toast.success(`User ${author} has been banned`);
  }
</script>

<div class="flex-1">
  <Header title="Content Moderation" description="Review and manage reported content" />

  <div class="p-8 space-y-6">
    <!-- Filter Tabs -->
    <div class="flex gap-2 border-b border-border">
      {#each ['all', 'reported', 'explicit', 'under-18'] as tab}
        <button
          onclick={() => filterTab = tab}
          class={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            filterTab === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab === 'all' ? 'All Content' : tab === 'reported' ? 'Reported' : tab === 'explicit' ? 'Explicit' : 'Under-18'}
        </button>
      {/each}
    </div>

    <!-- Content Table -->
    <div class="rounded-lg border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-secondary">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Content</th>
            <th class="px-6 py-3 text-left font-semibold">Author</th>
            <th class="px-6 py-3 text-left font-semibold">Type</th>
            <th class="px-6 py-3 text-left font-semibold">Flags</th>
            <th class="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#if loading}
            {#each Array(5) as _}
              <tr class="bg-white">
                <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
              </tr>
            {/each}
          {:else if content.length > 0}
            {#each content as item (item.id)}
              <tr class="bg-white hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{item.thumbnail}</span>
                    <p class="text-muted-foreground text-xs max-w-xs truncate">{item.text}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-foreground">@{item.author}</p>
                    <p class="text-xs text-muted-foreground">{item.authorAge} years old</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-muted-foreground">{item.type}</td>
                <td class="px-6 py-4">
                  {#if item.flags.length > 0}
                    <span class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">{item.flags[0]}</span>
                  {/if}
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button
                      onclick={() => handleDelete(item.id)}
                      class="text-red-600 hover:underline text-xs font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onclick={() => handleBanUser(item.author)}
                      class="text-orange-600 hover:underline text-xs font-medium"
                    >
                      Ban
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
