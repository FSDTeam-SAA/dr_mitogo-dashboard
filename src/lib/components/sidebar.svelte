<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/' },
    { label: 'Users', icon: '👥', href: '/users' },
    { label: 'Groups', icon: '👫', href: '/groups' },
    { label: 'Push Notifications', icon: '🔔', href: '/notifications' },
    { label: 'Ghost System', icon: '👻', href: '/ghost-system' },
    { label: 'FOMO Windows', icon: '⏰', href: '/fomo' },
    { label: 'Content Moderation', icon: '🚫', href: '/content' },
    { label: 'AI Settings', icon: '🤖', href: '/ai-settings' },
    { label: 'Verification', icon: '✓', href: '/verification' },
    { label: 'Support Tickets', icon: '🎫', href: '/tickets' },
    { label: 'Ad Campaigns', icon: '📢', href: '/ads' },
  ];

  function isActive(href: string) {
    return $page.url.pathname === href;
  }
</script>

<div class="h-screen bg-sidebar-background border-r border-sidebar-border overflow-y-auto fixed w-64 p-6">
  <div class="mb-8">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-2xl">🏘️</span>
      <h1 class="text-xl font-bold text-sidebar-primary">Casa Rancha</h1>
    </div>
    <p class="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
  </div>

  <nav class="space-y-2">
    {#each menuItems as item}
      <button
        onclick={() => goto(item.href)}
        class={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 text-sm font-medium transition-colors ${
          isActive(item.href)
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <span class="text-lg">{item.icon}</span>
        {item.label}
      </button>
    {/each}
  </nav>
</div>
