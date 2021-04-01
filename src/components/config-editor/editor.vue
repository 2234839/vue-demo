<template>
  <mark>
    因为使用了 vite 构建，所以这部分只能在高版本 chrome 下使用， Firefox
    下还不兼容 :
    <a
      href="https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/Worker#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7"
    >
      firefox 中不能使用 esm 的 import
    </a>
    <a href="https://github.com/vitejs/vite/issues/2550"> vite 相关 issues </a>
    <br />
  </mark>
  <div class="Editor" ref="root"></div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from "vue";
  import * as monaco from "monaco-editor";
  import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  // import A from "monaco-editor/dev/vs/editor/editor.main.js";
  // console.log("[A ]", A);

  // [Import monaco-editor using Vite 2](https://github.com/vitejs/vite/discussions/1791)

  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (["typescript", "javascript"].includes(label)) {
        return new TsWorker();
      }
      return new EditorWorker();
    },
  };
  export default defineComponent({
    setup() {
      const root = ref<HTMLElement>();
      let editor: monaco.editor.IStandaloneCodeEditor;
      onMounted(() => {
        editor = monaco.editor.create(root.value as HTMLElement, {
          language: "typescript",
          value: `console.log("hello world"); `,
        });
      });
      onUnmounted(() => {
        editor.dispose();
      });
      return {
        root,
      };
    },
  });
</script>

<style scoped>
  .Editor {
    height: 800px;
  }
</style>
