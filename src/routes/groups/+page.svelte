<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchGroups } from '$lib/api';
  import Header from '$lib/components/header.svelte';
  import GroupTable from '$lib/components/group-table.svelte';
  import type { Group } from '$lib/api';

  let groups = $state<Group[]>([]);
  let loading = $state(false);
  let page = $state(1);
  let totalPages = $state(1);

  onMount(async () => {
    await loadGroups();
  });

  async function loadGroups() {
    loading = true;
    const { groups: data, pages } = await fetchGroups(page, 5);
    groups = data;
    totalPages = pages;
    loading = false;
  }

  async function handlePageChange(newPage: number) {
    page = newPage;
    await loadGroups();
  }

  $effect(() => {
    loadGroups();
  });
</script>

<div class="flex-1">
  <Header title="Group Management" description="Manage all groups on the platform" />

  <div class="p-8 space-y-6">
    <GroupTable
      {groups}
      {loading}
      {page}
      {totalPages}
      onPageChange={handlePageChange}
    />
  </div>
</div>
