import { computed, ComputedRef, defineComponent, nextTick, reactive, ref, watchEffect } from "vue";
type table = Td[][];
type row_i = number;
type col_i = number;

export default defineComponent({
  setup() {
    const table = reactive([
      [new Td("1"), new Td("sum(select([0,1]))", true), new Td("sum(select([0,0])) + 42", true)],
      [new Td("2"), new Td("2"), new Td("2")],
      [
        new Td("sumFilterNaN(select([0,0],[0,1],[0,2]))", true),
        new Td("sum(select([1,0],[1,1],[1,2]))", true),
        new Td("sumFilterNaN(select([2,0],[2,1]))", true),
      ],
    ]);

    /** ═════════🏳‍🌈 下面这个块内的代码是测试用的 🏳‍🌈═════════  */
    {
      function repeatCall(f: Function, i: number) {
        if (i > 0) {
          f();
          repeatCall(f, i - 1);
        } else {
        }
      }
      repeatCall(addNewCol, 8);
      repeatCall(addNewRow, 8);
      /** 斐波那契数列测试 */
      table[0].forEach((el, index) => {
        if (index === 0) {
        } else if (index === 1) {
          el.isExp = true;
          el.value = `sum(select([0,${index - 1}]))`;
        } else {
          el.isExp = true;
          el.value = `sum(select([0,${index - 1}],[0,${index - 2}]))`;
        }
      });
      // 目前是没有优化的，再往后算上一轮就很慢了
      // table[1].forEach((el, index) => {
      //   if (index === 0) {
      //     el.isExp = true;
      //     el.value = `sum(select([0,10]))`;
      //   } else if (index === 1) {
      //     el.isExp = true;
      //     el.value = `sum(select([0,10],[1,${index - 1}]))`;
      //   } else {
      //     el.isExp = true;
      //     el.value = `sum(select([1,${index - 1}],[1,${index - 2}]))`;
      //   }
      // });
      // 等比数列测试
      table[2].forEach((el, index) => {
        if (index === 0) {
        } else {
          el.isExp = true;
          el.value = `sum(select([2,${index - 1}])) * 2`;
        }
      });
    }

    function addNewCol() {
      table.forEach((row) => row.push(new Td("1")));
    }
    function addNewRow() {
      const row = table[0].map(() => new Td("1"));
      table.push(row);
    }
    const selectTd = ref(new Td(""));
    function select(td: Td) {
      selectTd.value = td;
    }
    const editTd = ref(new Td(""));
    const editState = ref({
      show: false,
    });
    function edit(td: Td) {
      editTd.value = td;
      editState.value.show = true;
    }

    let updateTheOrder = 0;

    const updateLog = ref([] as [string, number][]);
    function addLog(p: string, t = performance.now()) {
      updateLog.value.push([p, t]);
    }
    const updateLogView = computed(() => [...updateLog.value].reverse());

    addLog(`// ${new Date().toLocaleString()} 程序启动`);

    watchEffect(() => {
      const length = updateLog.value.length;
      nextTick(() => {
        if (length === updateLog.value.length && !updateLog.value[length - 1][0].startsWith("//")) {
          const startLog_i = updateLogView.value.findIndex((el) => el[0].startsWith("//")) - 1;
          const elapsedTime = updateLog.value[length - 1][1] - updateLogView.value[startLog_i][1];
          addLog(`// ${new Date().toLocaleString()} 计算完毕,耗时 ${elapsedTime}ms`);
        }
      });
    });
    /** 从原始数据计算出值的新表 */
    const computedTable = computed(() =>
      table.map((row) =>
        row.map((td) => {
          return computed(() => {
            const value = evaluation(td, table);
            updateTheOrder += 1;
            addLog(`第${updateTheOrder}次计算，[${求坐标(td, table)}] 处的值为<${td.isExp ? "exp" : "raw"} ${value}>`);
            return {
              value,
              /** value 是哪一次计算出来的 */
              updateTheOrder,
            };
          });
        }),
      ),
    );

    return {
      table,
      computedTable,
      updateLogView,
      addNewRow,
      addNewCol,
      selectTd,
      select,
      editTd,
      editState,
      edit,
    };
  },
});

class Td {
  constructor(
    /** 值 */
    public value = "",
    /** 是否作为函数 */
    public isExp = false,
  ) {}
}

/** 求值函数，存在递归的问题 */
function evaluation(td: Td, table: table) {
  try {
    return evaluation1(td, []);
  } catch (error) {
    return String(error);
  }
  function evaluation1(td: Td, env: Td[]) {
    console.log("eval");

    if (env.includes(td)) {
      throw `<发现[${求坐标(td, table)}]处存在循环引用，无法求值>`;
    } else {
      if (td.isExp) {
        return inter(td.value);
      } else {
        return td.value;
      }
    }

    function inter(exp: string) {
      function select(...position: [row_i, col_i][]): Td[] {
        return position.map((el) => table[el[0]][el[1]]);
      }
      function sum(ls: Td[]): number {
        return ls.reduce((a, b) => {
          return a + Number(evaluation1(b, [...env, td]));
        }, 0);
      }
      /** 对值为转为数值之后是 nan 的当做不存在 */
      function sumFilterNaN(ls: Td[]) {
        return ls.reduce((a, b) => {
          const r = Number(evaluation1(b, [...env, td]));
          if (isNaN(r)) {
            return a;
          } else {
            return a + r;
          }
        }, 0);
      }
      return eval(
        exp,
        //@ts-expect-error  这里用于保证编译后 select 这些函数不被删除掉
        [select, sum, sumFilterNaN],
      );
    }
  }
}

function 求坐标(td: Td, table: table): [row_i, col_i] {
  const row_i = table.findIndex((el) => el.includes(td));
  return [row_i, table[row_i].findIndex((el) => el === td)];
}
