export const componentsList = {
  "higher-order": {
    getter: () => import("../higher-order/higher-order.tsx"),
    des: "vue 高阶组件",
  },
  vditor: {
    getter: () => import("../vditor/index.vue"),
    des: "vditor 编辑器",
  },
  location: {
    getter: () => import("../location/index.vue"),
    des: "获取并显示当前位置",
  },

  "reactive-table": {
    getter: () => import("../reactive-table/index.vue"),
    des:
      "一个像 excel 那样可以使用公式，改变了单元格的值 具有公式的单元格 的值会跟着一起变的表格实现",
  },

  "promise-loading": {
    getter: () => import("../promise-loading/promise-loading.vue"),
    des: "使用 vue composition-api 来实现 异步数据加载时的 loading 显示等",
  },

  undefined: {
    getter: () => import("./undefined.vue"),
    des: "用来处理未定义组件的显示",
  },
  b: {
    getter: () => import("./a.vue"),
    des: "动态组件引入测试 a",
  },
  a: {
    getter: () => import("./b.vue"),
    des: "用来动态组件引入测试 b",
  },
};

// 自动加载模块，不用手动在上面添加了
const modules = import.meta.glob("../*/index.vue");

Object.keys(modules).forEach((path) => {
  (componentsList as any)[path.slice(3, -10)] = {
    getter: modules[path],
    des: "",
  };
});
