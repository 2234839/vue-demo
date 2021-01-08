<template>
  <h1>崮生的 vue demo 测试</h1>
  <ComponentsList />
</template>

<script lang="ts">
  import ComponentsList from "./components/async-loade-test/components-list.vue";
  export default {
    name: "App",
    components: {
      ComponentsList,
    },
  };
</script>
