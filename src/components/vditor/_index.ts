import Vditor from "vditor";
import "vditor/dist/index.css";
import { defineComponent, onDeactivated, onUnmounted } from "vue";
export default defineComponent({
  setup(props, ctx) {
    function vditorDiv(el: HTMLElement) {
      if (el === null) {
        return;
      }
      const editor = new Vditor(el, {
        height: 600,
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
