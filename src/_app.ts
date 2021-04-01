import { computed, reactive, watchEffect } from "vue";
import ComponentsList from "./components/async-loade-test/components-list.vue";
export default {
  name: "App",
  setup() {
    const [AppOptions, href] = useParamsObj(
      undefined,
      {} as { template_name?: string },
    );

    watchEffect(() => {
      history.pushState("", "", href.value);
    });

    const templateName = computed({
      get: () => {
        return AppOptions.template_name;
      },
      set: (v) => {
        AppOptions.template_name = v;
      },
    });

    return { templateName };
  },
  components: {
    ComponentsList,
  },
};

/** 返回一个 params 对象与 href 字符串computed,href 依赖于 params */
function useParamsObj<T extends object>(
  urlStr = document.location.toString(),
  defaultParams: T,
) {
  const url = new URL(urlStr);
  const searchParams = url.searchParams;

  const params = reactive(defaultParams);

  searchParams.forEach((v, k) => {
    try {
      (params as any)[k] = atob(v);
    } catch (error) {
      // 兼容直接输入的情况
      (params as any)[k] = v;
    }
  });

  const href = computed(() => {
    Object.keys(params).forEach((k) => {
      const v = btoa((params as any)[k] || "");
      searchParams.set(k, v);
    });
    return url.href;
  });
  return [params, href] as const;
}
