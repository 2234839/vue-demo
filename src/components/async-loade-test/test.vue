<template>
  <input v-model="templateName" placeholder="输入「a」「b」或者其他字符" style="width: 400px" />
  <div>
    <component :is="template" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed, watchEffect, defineAsyncComponent } from "vue";
  import { componentsList } from "./components-list";
  export default defineComponent({
    setup(props, ctx) {
      const templateName = ref("");

      const template = computed(() =>
        defineAsyncComponent(
          (() => {
            if (templateName.value in componentsList) {
              return componentsList[templateName.value as keyof typeof componentsList];
            } else {
              return componentsList.undefined;
            }
          })(),
        ),
      );

      return { templateName, template };
    },
    components: {
      Aaa: defineAsyncComponent(componentsList.undefined),
    },
  });
</script>

<style></style>
