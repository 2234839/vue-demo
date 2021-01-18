<template>
  选择demo：
  <select v-model="templateName">
    <option disabled value="">请选择</option>
    <option v-for="(item, key) in componentsList" :key="key" :value="key">
      {{ key }}
    </option>
  </select>
  <input
    v-model="templateName"
    placeholder="输入「a」「b」或者其他 demo 名字来选择"
    style="width: 400px"
  />
  <div>组件描述：{{ component.des }}</div>

  <div style="border: 1px solid #333">
    <component :is="template" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, defineAsyncComponent } from "vue";
  import { componentsList } from "./components-list";
  export default defineComponent({
    props: {
      templateName: {
        type: String,
        default: "",
      },
    },
    emits: ["update:templateName"],
    setup(props, ctx) {
      const templateName = computed({
        get: () => props.templateName || "",
        set: (val) => ctx.emit("update:templateName", val),
      });

      const component = computed(() => {
        if (templateName.value in componentsList) {
          return componentsList[
            templateName.value as keyof typeof componentsList
          ];
        } else {
          return componentsList.undefined;
        }
      });
      const template = computed(() =>
        defineAsyncComponent(component.value.getter),
      );

      return { templateName, template, componentsList, component };
    },
  });
</script>

<style></style>
