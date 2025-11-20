<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchVerificationRequests } from '$lib/api';
  import { toast } from '$lib/toast-store';
  import Header from '$lib/components/header.svelte';
  import Skeleton from '$lib/components/skeleton.svelte';
  import type { VerificationRequest } from '$lib/api';

  let requests: VerificationRequest[] = $state([]);
  let loading: boolean = $state(false);

  onMount(async () => {
    loading = true;
    requests = await fetchVerificationRequests();
    loading = false;
  });

  function handleApprove(username: string) {
    toast.success(`${username} verified!`);
  }

  function handleReject(username: string) {
    toast.error(`${username} verification rejected`);
  }
</script>

<div class="flex-1">
  <Header title="Verification Requests" description="Process and manage user verification requests" />

  <div class="p-8 space-y-6">
    <div class="rounded-lg border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-secondary">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">User</th>
            <th class="px-6 py-3 text-left font-semibold">Followers</th>
            <th class="px-6 py-3 text-left font-semibold">Documents</th>
            <th class="px-6 py-3 text-left font-semibold">Request Date</th>
            <th class="px-6 py-3 text-left font-semibold">Status</th>
            <th class="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#if loading}
            {#each Array(3) as _}
              <tr class="bg-white">
                <td class="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
              </tr>
            {/each}
          {:else if requests.length > 0}
            {#each requests as req (req.id)}
              <tr class="bg-white hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img src={req.avatar || "/placeholder.svg"} alt={req.username} class="h-8 w-8 rounded-full" />
                    <div>
                      <p class="font-medium text-foreground">{req.username}</p>
                      <p class="text-xs text-muted-foreground">{req.displayName}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-foreground font-medium">{req.followers.toLocaleString()}</td>
                <td class="px-6 py-4">
                  {#if req.docsReceived}
                    <span class="text-green-600 font-medium">✓</span>
                  {:else}
                    <span class="text-gray-400">✗</span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-muted-foreground">{req.requestDate}</td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td class="px-6 py-4">
                  {#if req.status === 'pending'}
                    <div class="flex gap-2">
                      <button
                        onclick={() => handleApprove(req.username)}
                        class="text-green-600 hover:underline text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onclick={() => handleReject(req.username)}
                        class="text-red-600 hover:underline text-xs font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  {/if}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
