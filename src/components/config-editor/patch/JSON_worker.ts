//@ts-ignore
import * as worker from "monaco-editor/esm/vs/editor/editor.worker.js";
//@ts-ignore 这里引用我修改后的 monaco-json 项目，它将 ts 文件暴露出来了，使得 monaco-json 依赖 vscode-nls
import { ICreateData, JSONWorker } from "monaco-json/src/jsonWorker";
// 修改了 vscode-nls 新增 preproccess 对象，可以进行一些本地化的替换工作
import { format, preproccess, isPseudo } from "vscode-nls/src/common/common";

const tranMap = {
  TrailingComma: `数组尾随逗号`,
  PropertyExpected: "这里似乎缺少一个值",
  patternWarning: `字符串不符合正则 "{0}" 的模式。`,
  minLengthWarning: `字符串长度小于最小长度 {0}`,
  maxLengthWarning: `字符串长度大于最大长度 {0}`,
  uniqueItemsWarning: `Array有重复的项目`,
} as { [key: string]: string };
if (preproccess.localize === undefined) {
  preproccess.localize = (_key, message, args) => {
    if (typeof _key === "string" && tranMap[_key]) {
      message = tranMap[_key];
    } else {
      console.log("[未翻译的]", `"${_key}": \`${message}\`,`);
    }
    return format(message, args);
  };
}

class Worker extends JSONWorker {
  constructor(ctx: any, createData: ICreateData) {
    super(ctx, createData);
  }
  async doValidation(...args: any) {
    const v = await (super.doValidation as Function).apply(this, args);
    return v;
  }
}
self.onmessage = function () {
  //@ts-ignore ignore the first message
  worker.initialize(function (ctx, createData) {
    return new Worker(ctx, createData);
  });
};
