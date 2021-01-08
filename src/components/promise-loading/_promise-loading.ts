import { defineComponent, ref, reactive, watchEffect, computed } from "vue";
import { usePromiseComputed } from "./lib/vue.composition.api";

export default defineComponent({
  setup(props, ctx) {
    const searchText = ref("");
    const searchResults = usePromiseComputed({
      defaultData: [] as string[],
      getter() {
        return searchApi(searchText.value);

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
      },
    });
    watchEffect(
      () =>
        new Promise((s) => {
          console.log("444", searchText.value);

          s(3);
        }),
    );
    // const a = computed(
    //   // () =>
    //   //   new Promise((s) => {
    //   //     setTimeout(
    //   //       () =>
    //   //         s(
    //   //           [...searchText.value].map(
    //   //             (el) => `[${el}]  ${new Date().toLocaleString()}`,
    //   //           ),
    //   //         ),
    //   //       100,
    //   //     );
    //   //   }),
    // );
    watchEffect(() => {
      console.log("[searchResults.value.data]", searchResults.value.data);
    });
    watchEffect(() => {
      console.log("[searchText.value]", searchText.value);
    });

    return { searchText, searchResults };
  },
});
