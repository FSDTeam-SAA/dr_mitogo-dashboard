<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchUsers } from '$lib/api';
  import Header from '$lib/components/header.svelte';
  import UserTable from '$lib/components/user-table.svelte';
  import type { User } from '$lib/api';

  let users = $state<User[]>([]);
  let loading = $state(false);
  let page = $state(1);
  let totalPages = $state(1);
  let searchQuery = $state('');
  let statusFilter = $state('all');

  onMount(async () => {
    await loadUsers();
  });

  async function loadUsers() {
    loading = true;
    const { users: data, pages } = await fetchUsers(page, 5);
    users = data;
    totalPages = pages;
    loading = false;
  }

  async function handlePageChange(newPage: number) {
    page = newPage;
    await loadUsers();
  }

  $effect(() => {
    loadUsers();
  });
</script>

<div class="flex-1">
  <Header title="User Management" description="Manage all users on the platform" />

  <div class="p-8 space-y-6">
    <!-- Filters -->
    <div class="bg-white rounded-lg border border-border p-4 flex gap-4 flex-wrap">
      <input
        type="text"
        placeholder="Search by username, name, or email..."
        bind:value={searchQuery}
        class="px-4 py-2 border border-border rounded-md text-sm flex-1 min-w-64"
      />
      <select bind:value={statusFilter} class="px-4 py-2 border border-border rounded-md text-sm">
        <option value="all">All Statuses</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
        <option value="banned">Banned</option>
        <option value="restricted">Restricted</option>
      </select>
    </div>

    <!-- Users Table -->
    <UserTable
      {users}
      {loading}
      {page}
      {totalPages}
      onPageChange={handlePageChange}
    />
  </div>
</div>
