import { createApp, defineComponent, getCurrentInstance } from "vue";

function test() {
  console.log(getCurrentInstance()?.type.name);
}

const TestA = defineComponent({
  name: "TestA",
  setup(props, ctx) {
    test();
    return () => <>1</>;
  },
});
const TestB = defineComponent({
  name: "TestB",
  setup(props, ctx) {
    test();
    setTimeout(() => {
      test(); // 这里得到的是 undefined
    });
    return () => <>2</>;
  },
});

export default (
  <>
    333
    <TestA />
    <TestB />
  </>
);
