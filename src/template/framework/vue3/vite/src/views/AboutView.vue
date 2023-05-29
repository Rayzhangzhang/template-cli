<script setup lang="ts">
  import { reactive } from "vue";
  const state = reactive({ count: 0 })
</script>

<template>
  <div class="about">
    <h1>This is an about page {{state.count}}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
