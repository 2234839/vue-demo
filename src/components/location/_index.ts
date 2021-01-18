import { defineComponent, ref, reactive, watchEffect, computed } from "vue";
import { usePromiseComputed } from "../promise-loading/lib/vue.composition.api";

export default defineComponent({
  setup(props, ctx) {
    const position = usePromiseComputed({
      getter: () => getCurrentPosition(),
    });

    return { position };
  },
});

function getCurrentPosition() {
  return new Promise<
    [GeolocationPosition, undefined] | [undefined, GeolocationPositionError]
  >((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve([position, undefined]);
      },
      function (e) {
        resolve([undefined, e]);
      },
    );
  });
}
