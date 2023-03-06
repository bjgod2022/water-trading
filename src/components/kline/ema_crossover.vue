<script>
import { Overlay } from "trading-vue-js";

export default {
  name: "EMAX",
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: "GoodMoney$$$",
        version: "1.0.0",
        desc: "EMA crossover startegy",
      };
    },
    use_for() {
      return ["EMAX"];
    },
    calc() {
      return {
        props: {
          fastL: { def: 5, text: "5均线" },
          slowL: { def: 20, text: "20均线" },
        },
        conf: { renderer: "Splines" },
        update: `
                    let fast = ema(close, fastL)
                    let slow = ema(close, slowL)
                    let buy = crossover(fast, slow)[0]
                    let sell = crossunder(fast, slow)[0]
                    if (onclose()) {
                        signalif(buy, 'pump-it')
                        signalif(sell, 'dump-it')
                    }
                    if (buy || sell) {
                        onchart(
                            [buy ? 1 : 0, close[0], buy ? '买入' : '卖出'],
                            'Trades',
                            { type: 'Trades', zIndex: 1 }
                        )
                    }
                    onchart([fast, slow])
                `,
      };
    },
  },
};
</script>
