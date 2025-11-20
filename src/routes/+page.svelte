<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/components/header.svelte';
  import MetricCard from '$lib/components/metric-card.svelte';

  let mostActiveUsers = $state([
    { username: '@sophiaArt', posts: 245, comments: 512 },
    { username: '@oliviaStyle', posts: 198, comments: 445 },
    { username: '@avaDesigns', posts: 176, comments: 389 },
    { username: '@jessicakim', posts: 154, comments: 321 },
    { username: '@emmaMusic', posts: 132, comments: 278 }
  ]);

  let aiEngagement = $state({
    comments: 320,
    likes: 1150,
    replies: 75
  });

  let fomoStatus = $state('Active for another 02:14:36');
</script>

<div class="flex-1">
  <Header title="Dashboard" description="Welcome to Casa Rancha Admin Panel" />

  <div class="p-8 space-y-8">
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard label="Total Users" value="23,450" icon="👥" trend="+12% from last month" trendUp={true} />
      <MetricCard label="Online Now" value="421" icon="🟢" trend="+5% online" trendUp={true} />
      <MetricCard label="Verified Accounts" value="3,218" icon="✓" trend="+8% verified" trendUp={true} />
      <MetricCard label="Ghost Posts (24h)" value="1,032" icon="👻" trend="-3% activity" trendUp={false} />
      <MetricCard label="Flagged Content" value="47" icon="⚠️" trend="+2 items" trendUp={false} />
    </div>

    <!-- Active Users & AI Engagement -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg border border-border p-6">
        <h2 class="text-lg font-bold text-foreground mb-4">Top 5 Most Active Users</h2>
        <div class="space-y-4">
          {#each mostActiveUsers as user, index}
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-foreground">{index + 1}. {user.username}</p>
                <p class="text-xs text-muted-foreground">{user.posts} posts • {user.comments} comments</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary">{user.posts + user.comments}</p>
                <p class="text-xs text-muted-foreground">interactions</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="bg-white rounded-lg border border-border p-6">
        <h2 class="text-lg font-bold text-foreground mb-4">AI Engagement Today</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{aiEngagement.comments}</p>
            <p class="text-xs text-muted-foreground mt-2">AI Comments</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{aiEngagement.likes}</p>
            <p class="text-xs text-muted-foreground mt-2">AI Likes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{aiEngagement.replies}</p>
            <p class="text-xs text-muted-foreground mt-2">AI Replies</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FOMO & System Status -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg border border-border p-6">
        <h2 class="text-lg font-bold text-foreground mb-4">FOMO Window Status</h2>
        <div class="space-y-4">
          <div class="bg-secondary rounded p-4">
            <p class="text-sm font-medium text-foreground">{fomoStatus}</p>
            <p class="text-xs text-muted-foreground mt-2">Current FOMO window is active</p>
          </div>
          <div class="text-sm text-muted-foreground">
            <p>✓ 2,890 posts created</p>
            <p>✓ 1,240 unique users participated</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-border p-6">
        <h2 class="text-lg font-bold text-foreground mb-4">Flagged Explicit Content</h2>
        <div class="space-y-4">
          <div class="text-3xl font-bold text-primary">47</div>
          <div class="text-sm text-muted-foreground space-y-2">
            <p>Last 24 hours detected by AI</p>
            <p>✓ 23 items hidden from under-18</p>
            <p>✓ 8 items escalated for review</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
