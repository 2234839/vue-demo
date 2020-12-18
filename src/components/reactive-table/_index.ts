import { computed, ComputedRef, defineComponent, nextTick, reactive, ref, watchEffect } from "vue";
type table = Td[][];
type row_i = number;
type col_i = number;

export default defineComponent({
  setup() {
    const table = reactive([
      [new Td("1"), new Td("1"), new Td("1")],
      [new Td("2"), new Td("2"), new Td("2")],
      [
        new Td("sum(select([0,0],[0,1],[0,2]))", true),
        new Td("sum(select([1,0],[1,1],[1,2]))", true),
        new Td("sum(select([2,0],[2,1]))", true),
      ],
    ]);
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
    let time = performance.now();
    let computing = true;
    const updateLog = ref([] as string[]);
    function addLog(p: string) {
      if (computing === false) {
        time = performance.now();
      }
      updateLog.value.push(p);
    }
    const updateLogView = computed(() => [...updateLog.value].reverse());

    addLog(`// ${new Date().toLocaleString()} 程序启动`);

    watchEffect(() => {
      const length = updateLog.value.length;
      computing = true;
      if (updateLog.value[length - 1].startsWith("//")) {
        computing = false;
      }
      nextTick(() => {
        if (length === updateLog.value.length && !updateLog.value[length - 1].startsWith("//")) {
          addLog(`// ${new Date().toLocaleString()} 计算完毕,耗时 ${performance.now() - time}ms`);
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
            addLog(`第${updateTheOrder}次计算，值为 [${td.isExp ? "exp" : "raw"}] ${value}`);
            return {
              value,
              /** value 是哪一次计算出来的 */
              updateTheOrder,
            };
          });
        }),
      ),
    );
    watchEffect(() => {
      console.table(computedTable.value.map((el) => el.map((el) => el.value.value)));
    });
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

/** 求值函数 */
function evaluation(td: Td, table: table) {
  if (td.isExp) {
    return inter(td.value, table);
  } else {
    return td.value;
  }
}

function inter(exp: string, table: table) {
  function select(...position: [row_i, col_i][]): Td[] {
    return position.map((el) => table[el[0]][el[1]]);
  }
  function sum(ls: Td[]): number {
    return ls.reduce((a, b) => {
      return a + Number(evaluation(b, table));
    }, 0);
  }
  try {
    return eval(
      exp,
      //@ts-expect-error  这里用于保证编译后 select 这些函数不被删除掉
      [select, sum],
    );
  } catch (error) {
    return String(error);
  }
}
