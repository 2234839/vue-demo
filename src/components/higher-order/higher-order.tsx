import { defineComponent, ref } from "vue";

const data = ref([1, 2, 3, 4, 5]);

setInterval(() => {
  data.value[0] = Date.now();
}, 1000);

//                         传递泛型
const ListComponent = list<number>();

//                            这里可以看到约束了 data 的类型必须是 number[]
export default <ListComponent data={data.value} />;

function list<T>() {
  return defineComponent({
    props: {
      data: {
        type: Array as () => T[],
        default: [],
      },
    },
    setup(props, ctx) {
      return () => (
        <div>
          {props.data.map((el) => (
            <div>{el}</div>
          ))}
        </div>
      );
    },
  });
}
