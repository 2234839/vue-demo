<template>
  <div class="Editor" ref="root"></div>
</template>
<script lang="ts">
  // import "./patch/localize";
  import * as monaco from "monaco-editor";
  // import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import JSON_Worker from "./patch/JSON_worker?worker";
  // import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import { defineComponent, onDeactivated, onMounted, ref } from "vue";

  // JSON_Worker.prototype.format = function (...args: any) {
  //   const v = (doHover as Function).apply(this, args);
  //   console.log("[v]", v);
  //   return v;
  // };
  // console.log('[JSON_Worker]',JSON_Worker)
  // import A from "monaco-editor/dev/vs/editor/editor.main.js";
  // console.log("[A ]", A);

  // [Import monaco-editor using Vite 2](https://github.com/vitejs/vite/discussions/1791)
  // Configures two JSON schemas, with references.

  // [配置样例](https://github.com/microsoft/monaco-editor/issues/727#issuecomment-369939602)
  var jsonCode = `{
    "enum": "v1",
    "p2": {
        "q1": {
            "s": [
                "ui"
            ],
            "n": 88
        }
    }, //允许使用注释
    "brackets": [
        [ "(", ")"],
        [ "{", "}"],
    ],
    "uniqueItemsTest": ["a","a"],
    "TestExample": {
        "patternTest1": "aa3",
        "patternTest2": "aas",

        "LengthTest1": "s",
        "LengthTest2": "ss",
        "LengthTest3": "01234567891",
    }
}`;
  var modelUri = monaco.Uri.parse(
    `a://config-${
      /** 避免因为 hmr 导致的反复 add model 到同一个 modelUri*/
      Date.now()
    }.json`,
  ); // a made up unique URI for our model

  var model = monaco.editor.createModel(jsonCode, "json", modelUri);

  // configure the JSON language support with schemas and schema associations
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true,
    schemaValidation: "error",
    schemaRequest: "error",
    allowComments: false,
    /**
     * [vscode 中 schema 定义](https://github.com/microsoft/vscode/blob/81f2d352a35eb5b48c1fb32e34cb699f69d744bf/src/vs/base/common/jsonSchema.ts)
     * 可以按这样的 `markdownDescription: {` 格式在源码中搜索实例
     *
     * [json schema 文档中文翻译](https://www.jianshu.com/p/fc97c1bbea39)
     *
     * ## 还未在这里添加示例的属性
     * `additionalProperties` `dependencies` `additionalItems`
     */
    schemas: [
      {
        uri: "http://myserver/foo-schema.json", // id of the first schema
        fileMatch: [modelUri.toString()], // associate with our model
        schema: {
          type: ["object", "string"],
          title: "根配置",
          description: "root object 配置集合",
          required: ["enum"],
          definitions: {
            openBracket: {
              type: "string",
              description: "The opening bracket character or string sequence.",
            },
            closeBracket: {
              type: "string",
              description: "The closing bracket character or string sequence.",
            },
            bracketPair: {
              type: "array",
              items: [
                {
                  $ref: "#definitions/openBracket",
                },
                {
                  $ref: "#definitions/closeBracket",
                },
              ],
            },
          },
          properties: {
            TestExample: {
              title: "测试 string 相关",
              $comment: "属性正则很有意思",
              // 按正则匹配 q1 的属性的属性名然后应用对应的规则
              patternProperties: {
                "pattern(.*?)$": {
                  type: "string",
                  // 约束值需要符合此正则
                  pattern: "aa([0-9]+)",
                },
                "Length(.*?)$": {
                  type: "string",
                  minLength: 2,
                  maxLength: 10,
                },
              },
            },
            enum: {
              title: "Enum 配置",
              type: "string",
              enum: ["v1", "v2"],
              // 设置默认值，用户输入的时候会有代码片段提醒
              default: "v1",
              enumDescriptions: ["v1 使用版本1", "v2 使用版本 2"],
              // `markdownDescription` 在显示上会覆盖 `description`
              markdownDescription: "**枚举配置测试**",
              description: "枚举配置测试",
              // 提醒使用者不在使用这个属性，会在属性下附加警告波浪线
              deprecationMessage: "不再建议使用此属性，建议使用 `aaa`",
            },
            brackets: {
              type: "array",
              title: "#definitions 测试",
              default: [
                ["(", ")"],
                ["{", "}"],
              ],
              // 设置最少需要一个条目
              minItems: 1,
              // 设置最多只能有两个条目
              maxItems: 2,
              description:
                "Defines the bracket symbols that increase or decrease the indentation.",
              items: {
                $ref: "#definitions/bracketPair",
              },
            },
            uniqueItemsTest: {
              type: "array",
              // 设置 数组值不可以重复（注意：对象虽然看起来一样但不会认为是重复的）
              uniqueItems: true,
              items: {
                type: "string",
              },
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
          defaultSnippets: [{ body: { title: "", properties: {} } }],
          properties: {
            q1: {
              // 按正则匹配 q1 的属性的属性名然后应用对应的规则
              patternProperties: {
                "(.*?)s$": {
                  title: "patternProperties string",
                  oneOf: [{ type: "array", items: { type: "string" } }],
                  default: ["ui"],
                },
                "(.*?)n$": {
                  title: "patternProperties number",
                  type: "number",
                },
              },
              // 设置最少需要一个属性
              minProperties: 1,
              // 设置最多只能有三个属性
              maxProperties: 3,
            },
          },
        },
      },
    ],
  });
  // import.meta.hot

  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      return new JSON_Worker();

      // if (["typescript", "javascript"].includes(label)) {
      //   // return new TsWorker();
      //   return new EditorWorker();
      // } else if (label === "json") {
      //   return new JSON_Worker();
      // }
      // return new EditorWorker();
    },
  };

  export default defineComponent({
    setup() {
      const root = ref<HTMLElement>();
      let editor: monaco.editor.IStandaloneCodeEditor;
      onMounted(() => {
        editor = monaco.editor.create(root.value as HTMLElement, {
          model,
        });
      });
      onDeactivated(() => {
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
