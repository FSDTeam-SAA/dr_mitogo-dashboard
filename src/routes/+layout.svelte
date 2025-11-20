<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/sidebar.svelte';
  import ToastContainer from '$lib/components/toast-container.svelte';

  let { children } = $props();
</script>

<!-- Added proper main container with gradient background -->
<div class="min-h-screen" style="background: linear-gradient(180deg, #FFE7E6 0%, #FFFFFF 24.6%);">
  <div class="flex">
    <Sidebar />
    <main class="flex-1 ml-64">
      {@render children()}
    </main>
  </div>
  <ToastContainer />
</div>
