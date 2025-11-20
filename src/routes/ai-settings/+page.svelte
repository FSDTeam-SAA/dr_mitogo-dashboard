<script lang="ts">
  import { toast } from '$lib/toast-store';
  import Header from '$lib/components/header.svelte';

  let aiCommentsEnabled = $state(true);
  let aiLikesEnabled = $state(true);
  let aiRepliesEnabled = $state(true);
  let maxCommentsPerHour = $state(50);
  let maxLikesPerHour = $state(150);
  let explicitFilterEnabled = true;
</script>

<div class="flex-1">
  <Header title="AI & Automation Settings" description="Configure AI engagement and content filtering" />

  <div class="p-8 space-y-8">
    <!-- AI Engagement Settings -->
    <div class="bg-white rounded-lg border border-border p-6">
      <h2 class="text-lg font-bold text-foreground mb-6">AI Engagement Controls</h2>
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <label for="ai-comments" class="font-medium text-foreground">Enable AI Comments</label>
            <p class="text-xs text-muted-foreground">AI can post comments on content</p>
          </div>
          <button
            id="ai-comments"
            onclick={() => {
              aiCommentsEnabled = !aiCommentsEnabled;
              toast.success(`AI Comments ${aiCommentsEnabled ? 'enabled' : 'disabled'}`);
            }}
            class={`px-4 py-2 rounded-md text-sm font-medium ${
              aiCommentsEnabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
            }`}
          >
            {aiCommentsEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label for="ai-likes" class="font-medium text-foreground">Enable AI Likes</label>
            <p class="text-xs text-muted-foreground">AI can like posts and content</p>
          </div>
          <button
            id="ai-likes"
            onclick={() => {
              aiLikesEnabled = !aiLikesEnabled;
              toast.success(`AI Likes ${aiLikesEnabled ? 'enabled' : 'disabled'}`);
            }}
            class={`px-4 py-2 rounded-md text-sm font-medium ${
              aiLikesEnabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
            }`}
          >
            {aiLikesEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <label for="ai-replies" class="font-medium text-foreground">Enable AI Replies</label>
            <p class="text-xs text-muted-foreground">AI can reply to comments</p>
          </div>
          <button
            id="ai-replies"
            onclick={() => {
              aiRepliesEnabled = !aiRepliesEnabled;
              toast.success(`AI Replies ${aiRepliesEnabled ? 'enabled' : 'disabled'}`);
            }}
            class={`px-4 py-2 rounded-md text-sm font-medium ${
              aiRepliesEnabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
            }`}
          >
            {aiRepliesEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div class="border-t border-border pt-6">
          <label for="max-comments" class="block text-sm font-medium text-foreground mb-3">Max AI Comments per Hour</label>
          <div class="flex items-center gap-4">
            <input type="range" bind:value={maxCommentsPerHour} min="10" max="200" class="flex-1" id="max-comments" />
            <span class="text-foreground font-medium w-12">{maxCommentsPerHour}</span>
          </div>
        </div>

        <div>
          <label for="max-likes" class="block text-sm font-medium text-foreground mb-3">Max AI Likes per Hour</label>
          <div class="flex items-center gap-4">
            <input type="range" bind:value={maxLikesPerHour} min="50" max="500" class="flex-1" id="max-likes" />
            <span class="text-foreground font-medium w-12">{maxLikesPerHour}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Engagement Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-lg border border-border p-6 text-center">
        <p class="text-3xl font-bold text-primary">320</p>
        <p class="text-xs text-muted-foreground mt-2">AI Comments Today</p>
      </div>
      <div class="bg-white rounded-lg border border-border p-6 text-center">
        <p class="text-3xl font-bold text-primary">1,150</p>
        <p class="text-xs text-muted-foreground mt-2">AI Likes Today</p>
      </div>
      <div class="bg-white rounded-lg border border-border p-6 text-center">
        <p class="text-3xl font-bold text-primary">75</p>
        <p class="text-xs text-muted-foreground mt-2">AI Replies Today</p>
      </div>
    </div>

    <!-- Explicit Content Filter -->
    <div class="bg-white rounded-lg border border-border p-6">
      <h2 class="text-lg font-bold text-foreground mb-6">AI Explicit Content Filter</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <label for="explicit-filter" class="font-medium text-foreground">Hide Explicit Content from Under-18</label>
            <p class="text-xs text-muted-foreground">Always enabled for user safety</p>
          </div>
          <button
            disabled
            id="explicit-filter"
            class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground opacity-50 cursor-not-allowed"
          >
            Enabled
          </button>
        </div>

        <div class="border-t border-border pt-4 grid grid-cols-3 gap-4">
          <div>
            <p class="text-2xl font-bold text-primary">89</p>
            <p class="text-xs text-muted-foreground">Items Detected (24h)</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-primary">45</p>
            <p class="text-xs text-muted-foreground">Hidden from Under-18</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-primary">12</p>
            <p class="text-xs text-muted-foreground">Escalated for Review</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
