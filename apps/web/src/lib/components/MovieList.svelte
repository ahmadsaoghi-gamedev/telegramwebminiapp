<script>
  // No script needed for now
</script>

<div class="p-4">
  <h2 class="text-xl font-bold mb-4">Terbaru (20 film)</h2>
  <div class="space-y-4">
    {#each Array(3) as _, i}
      <p>Movie list item {i + 1} will go here.</p>
    {/each}
  </div>
</div>
