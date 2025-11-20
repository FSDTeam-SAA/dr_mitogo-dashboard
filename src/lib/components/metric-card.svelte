<script lang="ts">
  interface Props {
    label?: string;
    value?: string;
    icon?: string;
    trend?: string;
    trendUp?: boolean;
  }

  let {
    label = '',
    value = '0',
    icon = '📊',
    trend = '',
    trendUp = true
  }: Props = $props();
</script>

<div class="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-muted-foreground text-sm font-medium">{label}</p>
      <p class="text-3xl font-bold text-foreground mt-2">{value}</p>
      {#if trend}
        <p class={`text-xs mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      {/if}
    </div>
    <div class="text-3xl">{icon}</div>
  </div>
</div>
