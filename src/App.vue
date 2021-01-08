<template>
  <h1>崮生的 vue demo 测试</h1>
  <ComponentsList :defaultTemplateName="defaultTemplateName" />
</template>

<script lang="ts">
  import ComponentsList from "./components/async-loade-test/components-list.vue";
  export default {
    name: "App",
    setup() {
      const params = new URL(document.location.toString()).searchParams;
      const defaultTemplateName = params.get("template_name");
      return { defaultTemplateName };
    },
    components: {
      ComponentsList,
    },
  };
</script>
