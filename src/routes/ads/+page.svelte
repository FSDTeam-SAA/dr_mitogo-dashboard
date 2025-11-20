<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchAdCampaigns } from '$lib/api';
  import { toast } from '$lib/toast-store';
  import Header from '$lib/components/header.svelte';
  import Skeleton from '$lib/components/skeleton.svelte';
  import type { AdCampaign } from '$lib/api';

  let campaigns = $state<AdCampaign[]>([]);
  let loading = $state(false);

  onMount(async () => {
    loading = true;
    campaigns = await fetchAdCampaigns();
    loading = false;
  });

  function handlePauseResume(id: string, status: string) {
    toast.success(`Campaign ${status === 'active' ? 'paused' : 'resumed'}`);
  }
</script>

<div class="flex-1">
  <Header title="Ad Campaigns" description="Manage advertising campaigns and performance" />

  <div class="p-8 space-y-8">
    <!-- Create Campaign Button -->
    <button class="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90">
      + Create New Campaign
    </button>

    <!-- Campaigns Table -->
    <div class="rounded-lg border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-secondary">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Campaign Name</th>
            <th class="px-6 py-3 text-left font-semibold">Status</th>
            <th class="px-6 py-3 text-left font-semibold">Impressions</th>
            <th class="px-6 py-3 text-left font-semibold">Clicks</th>
            <th class="px-6 py-3 text-left font-semibold">CTR</th>
            <th class="px-6 py-3 text-left font-semibold">Duration</th>
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
                <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                <td class="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
              </tr>
            {/each}
          {:else if campaigns.length > 0}
            {#each campaigns as campaign (campaign.id)}
              <tr class="bg-white hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-foreground">{campaign.name}</td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-foreground font-medium">{campaign.impressions.toLocaleString()}</td>
                <td class="px-6 py-4 text-foreground font-medium">{campaign.clicks.toLocaleString()}</td>
                <td class="px-6 py-4 text-foreground font-medium">{campaign.ctr.toFixed(1)}%</td>
                <td class="px-6 py-4 text-muted-foreground">{campaign.startDate} to {campaign.endDate}</td>
                <td class="px-6 py-4">
                  <button
                    onclick={() => handlePauseResume(campaign.id, campaign.status)}
                    class="text-primary hover:underline text-xs font-medium"
                  >
                    {campaign.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
