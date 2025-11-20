<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchFOMOWindows } from '$lib/api';
  import Header from '$lib/components/header.svelte';
  import Skeleton from '$lib/components/skeleton.svelte';
  import type { FOMOWindow } from '$lib/api';

  let fomoWindows = $state<FOMOWindow[]>([]);
  let loading = $state(false);

  onMount(async () => {
    loading = true;
    fomoWindows = await fetchFOMOWindows();
    loading = false;
  });
</script>

<div class="flex-1">
  <Header title="FOMO Windows" description="Manage Fear of Missing Out time windows" />

  <div class="p-8 space-y-8">
    <!-- Create FOMO Window -->
    <div class="bg-white rounded-lg border border-border p-6">
      <h2 class="text-lg font-bold text-foreground mb-4">Create FOMO Window</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="startDateTime" class="block text-sm font-medium text-foreground mb-2">Start Date & Time</label>
          <input type="datetime-local" id="startDateTime" class="w-full px-4 py-2 border border-border rounded-md text-sm" />
        </div>
        <div>
          <label for="endDateTime" class="block text-sm font-medium text-foreground mb-2">End Date & Time</label>
          <input type="datetime-local" id="endDateTime" class="w-full px-4 py-2 border border-border rounded-md text-sm" />
        </div>
        <div class="col-span-2">
          <label for="description" class="block text-sm font-medium text-foreground mb-2">Description</label>
          <input type="text" id="description" placeholder="e.g., Weekend Anonymous Party Stories" class="w-full px-4 py-2 border border-border rounded-md text-sm" />
        </div>
        <button class="col-span-2 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90">
          Create FOMO Window
        </button>
      </div>
    </div>

    <!-- FOMO Windows List -->
    <div>
      <h2 class="text-lg font-bold text-foreground mb-4">Active & Past FOMO Windows</h2>
      <div class="rounded-lg border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-secondary">
            <tr>
              <th class="px-6 py-3 text-left font-semibold">Name</th>
              <th class="px-6 py-3 text-left font-semibold">Start</th>
              <th class="px-6 py-3 text-left font-semibold">End</th>
              <th class="px-6 py-3 text-left font-semibold">Status</th>
              <th class="px-6 py-3 text-left font-semibold">Posts Created</th>
              <th class="px-6 py-3 text-left font-semibold">Unique Users</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#if loading}
              {#each Array(3) as _}
                <tr class="bg-white">
                  <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                  <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                </tr>
              {/each}
            {:else if fomoWindows.length > 0}
              {#each fomoWindows as window (window.id)}
                <tr class="bg-white hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-foreground">{window.name}</td>
                  <td class="px-6 py-4 text-muted-foreground">{window.start}</td>
                  <td class="px-6 py-4 text-muted-foreground">{window.end}</td>
                  <td class="px-6 py-4">
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                      window.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {window.active ? 'Active' : 'Ended'}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-foreground font-medium">{window.postsCreated}</td>
                  <td class="px-6 py-4 text-foreground font-medium">{window.uniqueUsers}</td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
