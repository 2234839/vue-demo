import { defineComponent, onDeactivated, ref, Ref } from "vue";

const a = ref([1, 2, 3, 4, 5]);

export default list(a);

function list<T>(data: Ref<T[]>) {
  const ListComponent = defineComponent({
    props: {
      data: {
        type: Array as () => T[],
        default: [],
      },
    },
    setup(props, ctx) {
      const id = setInterval(() => {
        data.value[0] = (Date.now() as unknown) as T;
      }, 1000);

      onDeactivated(() => clearInterval(id));

      return () => (
        <div>
          {props.data.map((el) => (
            <div>{el}</div>
          ))}
        </div>
      );
    },
  });
  return () => <ListComponent data={data.value}>333</ListComponent>;
}
