import { computed, ComputedRef, defineComponent, reactive, watchEffect } from "vue";
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

    /** 从原始数据计算出值的新表 */
    const computedTable = computed(() =>
      table.map((row) =>
        row.map((td) => {
          return computed(() => {
            const v = evaluation(td, table);
            console.log(`[${td.isExp ? "exp" : "raw"}]` + td.value);
            return v;
          });
        }),
      ),
    );
    watchEffect(() => {
      console.table(computedTable.value.map((el) => el.map((el) => el.value)));
    });
    return {
      table,
      computedTable,
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
