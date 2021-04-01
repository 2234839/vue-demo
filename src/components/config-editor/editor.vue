<template>
  <div class="Editor" ref="root"></div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from "vue";
  import * as monaco from "monaco-editor";
  import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import JSON_Worker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  // import A from "monaco-editor/dev/vs/editor/editor.main.js";
  // console.log("[A ]", A);

  // [Import monaco-editor using Vite 2](https://github.com/vitejs/vite/discussions/1791)
  // Configures two JSON schemas, with references.



  // [配置样例](https://github.com/microsoft/monaco-editor/issues/727#issuecomment-369939602)
  var jsonCode = ["{", '    "p1": "v3",', '    "p2": false', "}"].join("\n");
  var modelUri = monaco.Uri.parse("a://b/foo.json"); // a made up unique URI for our model
  var model = monaco.editor.createModel(jsonCode, "json", modelUri);

  // configure the JSON language support with schemas and schema associations
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: "http://myserver/foo-schema.json", // id of the first schema
        fileMatch: [modelUri.toString()], // associate with our model
        schema: {
          type: "object",
          properties: {
            p1: {
              enum: ["v1", "v2"],
            },
            p2: {
              $ref: "http://myserver/bar-schema.json", // reference the second schema
            },
          },
        },
      },
      {
        uri: "http://myserver/bar-schema.json", // id of the second schema
        schema: {
          type: "object",
          properties: {
            q1: {
              enum: ["x1", "x2"],
            },
          },
        },
      },
    ],
  });

  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (["typescript", "javascript"].includes(label)) {
        return new TsWorker();
      } else if (label === "json") {
        return new JSON_Worker();
      }
      console.log("[JSON_Worker]", JSON_Worker);
      return new EditorWorker();
    },
  };
  export default defineComponent({
    setup() {
      const root = ref<HTMLElement>();
      let editor: monaco.editor.IStandaloneCodeEditor;
      onMounted(() => {
        editor = monaco.editor.create(root.value as HTMLElement, {
          model,
          language: "json",
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

  export const des = `222`;
</script>

<style scoped>
  .Editor {
    height: 800px;
  }
</style>
