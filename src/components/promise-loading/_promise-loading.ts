import { defineComponent, ref } from "vue";
import { usePromiseComputed } from "./lib/vue.composition.api";

export default defineComponent({
  setup(props, ctx) {
    const searchText = ref("");

    const searchResults = usePromiseComputed({
      defaultData: [] as string[],
      getter() {
        return searchApi(searchText.value);
      },
    });

    return { searchText, searchResults };
  },
});

function searchApi(searchText: string) {
  return new Promise<string[]>((s, j) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        s([`[查询成功] ： 搜索的字符串 「${searchText}」`]);
      } else {
        j([`[查询失败] ： 搜索的字符串 「${searchText}」`]);
      }
    }, 1000);
  });
}
