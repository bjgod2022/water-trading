<template>
    <trading-vue :data="dc" :width="this.width" :height="this.height / 2" title-txt="日线" :key="resetkey" ref="tvjsday"
        :legend-buttons="['display', 'settings', 'up', 'down', 'add', 'remove']" :chart-config="{ DEFAULT_LEN: 70 }"
        :color-back="colors.colorBack" :color-grid="colors.colorGrid" :color-text="colors.colorText" :extensions="ext"
        :overlays="ovs" :x-settings="xsett" :index-based="true" :timezone="8" :toolbar="true" />
</template>
<script>

import TradingVue from "@/components/trading-vue-js/trading-vue.js"
import { DataCube } from "@/components/trading-vue-js/trading-vue.js"

// import { DataCube } from 'trading-vue-js'
import Overlays from 'tvjs-overlays'
import Data from '../data/data.json'
// import { mapActions } from "vuex";
import { appendScript } from '@/common/js/util'



export default {
    name: 'App1',
    props: ['night', 'ext', 'resetkey', 'stock'],
    components: {
        TradingVue
    },
    data () {
        return {
            timer: "", // 定时刷新器
            dc: new DataCube(Data),
            width: window.innerWidth,
            height: window.innerHeight,
            xsett: {
                'grid-resize': { min_height: 30 }
            },
            ovs: Object.values(Overlays)
        }
    },
    methods: {
        initChart () {
            this.setoldCharts();

            this.timer = setInterval(() => {
                // if (ifCurTimeIsTradeTime()) {
                //判断当前是否为交易时间
                this.setoldCharts();
                // }
            }, 3000);
        },
        onResize (event) {
            this.width = window.innerWidth
            this.height = window.innerHeight - 50
        },
        // ...mapActions(["klines"]),

        setoldCharts () {
            // let code_can = `${this.stock.prefix}${this.stock.code}`
            let code_can = `${this.stock.codes}`
            let _api = `http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq&param=${code_can},day,,,770,qfq&r=${Math.random()}`
            new Promise((resolve, reject) => {
                appendScript(_api).then(() => {
                    let _datas = window[`kline_dayqfq`].data[code_can]['qfqday'] || window[`kline_dayqfq`].data[code_can]['day']
                    let _klines = []
                    _datas.forEach(data => {
                        _klines.push([
                            new Date(data[0].replace(/-/g, "/")).getTime(),

                            parseFloat(data[1]),
                            parseFloat(data[3]),
                            parseFloat(data[4]),
                            parseFloat(data[2]),
                            parseInt(data[5])
                        ]

                        )

                    })
                    Data.ohlcv = _klines;
                    // resolve(_klines)

                })
            })
            // let code_can = `${this.stock.prefix}${this.stock.code}`
            // console.log(code_can, 'code_can')
            // this.klines({ stock: this.stock, klineType: "day" }).then((data) => {
            //     let values = [];
            //     for (let i = 0; i < data.list.length; i++) {
            //         values.push([
            //             // data.list[i].time,
            //             // format(data.list[i].time),
            //             new Date(data.list[i].time.replace(/-/g, "/")).getTime(),
            //             data.list[i].start * 1,
            //             data.list[i].high * 1,
            //             data.list[i].low * 1,
            //             data.list[i].end * 1,

            //             data.list[i].volumn * 1,
            //         ]);
            //     }
            //     Data.ohlcv = values;
            //     // console.log(Data, 'Std')

            // });

            // return values;

        },
    },
    mounted () {
        this.initChart();
        window.addEventListener('resize', this.onResize)
        this.onResize()
        window.dc = this.dc
        window.tv = this.$refs.tvjsday
        // this.initChart();

    },
    beforeDestroy () {
        window.removeEventListener("resize", this.onResize);
        // console.log(this.stream, "this.stream");
        // if (this.stream) this.stream.off();

        this.$once("hook:beforeDestroy", () => {
            clearInterval(this.timer);
        });
    },
    computed: {
        colors () {
            return this.$props.night ? {} : {
                colorBack: '#fff',
                colorGrid: '#eee',
                colorText: '#333'
            }
        },
    },
    beforeDestroy () {
        window.removeEventListener('resize', this.onResize)
    },

}
</script>
<style>

</style>
