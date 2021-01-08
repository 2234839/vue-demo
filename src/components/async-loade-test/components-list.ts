export const componentsList = {
  a: () => import("./a.vue"),
  b: () => import("./b.vue"),
  "reactive-table": () => import("../reactive-table/index.vue"),
  undefined: () => import("./undefined.vue"),
};
