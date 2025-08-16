<script>
  import BottomNav from '$lib/components/BottomNav.svelte';
</script>

<div class="flex flex-col min-h-screen bg-white">
  <main class="flex-grow overflow-y-auto p-4 pb-20">
    <slot />
  </main>
  <footer class="fixed bottom-0 w-full z-10 bg-[#f9f9f9] border-t border-gray-200">
    <BottomNav />
  </footer>
</div>
