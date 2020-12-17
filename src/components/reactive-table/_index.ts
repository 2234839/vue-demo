import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    type table = Td[][];
    type row_i = number;
    type col_i = number;

    const table: table = reactive([
      [new Td("1"), new Td("1"), new Td("1")],
      [new Td("2"), new Td("2"), new Td("2")],
      [
        new Td("sum(select([0,0],[0,1],[0,2]))", true),
        new Td("sum(select([1,0],[1,1],[1,2]))", true),
        new Td("sum(select([2,0],[2,1]))", true),
      ],
    ]);

    function valueOf(td: Td) {
      if (td.isExp) {
        console.log("[td] inter", td);
        return inter(td, table);
      } else {
        return td.value;
      }
    }

    function inter(td: Td, table: table) {
      function select(...position: [row_i, col_i][]): Td[] {
        return position.map((el) => table[el[0]][el[1]]);
      }
      function sum(ls: Td[]): number {
        return ls.reduce((a, b) => {
          return a + Number(valueOf(b));
        }, 0);
      }
      return eval(td.value);
    }
    return { table, valueOf };
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
