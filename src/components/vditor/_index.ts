import Vditor from "vditor";
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import "vditor/dist/index.css";
export default defineComponent({
  setup(props, ctx) {
    function vditorDiv(el: HTMLElement) {
      const editor = new Vditor(el, {
        height: 360,
        toolbarConfig: {
          pin: true,
        },
        cache: {
          enable: false,
        },
        after: () => {
          editor.setValue("hello, Vditor + Vue!");
        },
      });
      return editor;
    }
    return { vditorDiv };
  },
});
