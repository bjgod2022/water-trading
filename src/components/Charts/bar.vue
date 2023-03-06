<template>
    
    <div class="his_box">
    <!-- <div>成绩分布直方图</div> -->
    <div class="histogram">
        <div class="graph" v-for="(item, i) in readingHoursHeight">
            <div :style="{width:item+'%'}" v-bind:interval="3000">
                {{ item }}
            </div>
        </div>
     
    </div>
</div>

</template>
<script>
export default {
    props: {
        //     stockCode: {
        //         type: String
        //     },
        //     className: {
        //         type: String,
        //         default: 'chart'
        //     },
            id: {
                type: String,
                default: 'chart'
            },
            buy: {
                type:  Array ,
                default: 'chart'
            },
            sell: {
                type:  Array ,
                default: 'chart'
            },
            width: {
                type: String,
                default: '280px'
            },
            height: {
                type: String,
                default: '580px'
            }
        },
        data(){
            return{
                readingHours: [
                    // this.buy[4].count,
                    // this.buy[3].count,
                    // this.buy[2].count, 
                    // this.buy[1].count,
                    // this.buy[0].count,
                    // this.sell[0].count,
                    // this.sell[1].count, 
                    // this.sell[2].count,
                    // this.sell[3].count,
                    // this.sell[4].count
                    this.sell[4].count,
                    this.sell[3].count, 
                    this.sell[2].count,
                    this.sell[1].count,
                    this.sell[0].count,
                    this.buy[0].count,
                    this.buy[1].count,
                    this.buy[2].count, 
                    this.buy[3].count,
                    this.buy[4].count,
                    
                ],
                // 计算时长的高度
                readingHoursHeight: []


            }
        },
        mounted() {
            
            this.computeBarHeight()
        },
        watch: {
           
           sell:function(val){  //<- 修改这里 监听这个值是否发生变化
               this.computeBarHeight()
           }
        },
        methods:{
            computeBarHeight: function (val) {
                this.readingHoursHeight=[]
                // box的高度
                var boxHeight = 0
                // 获取最长的时长，作为最大的高度
                var max = this.maxHours(this.readingHours)
                for (let i = 0; i < this.readingHours.length; i++) {
                    // console.log(this.readingHours[i],this.readingHours[max])
                  this.pmax =  this.readingHours[i]/max*100
                  this.readingHoursHeight.push(this.pmax)
                //   this.pmax =0
            }
            return this.readingHoursHeight


            },
            maxHours: function (arr) {
            var tmax = arr[0]* 1
           
            for (let i =1; i < arr.length; i++) {
                if (arr[i]* 1 > tmax) {
                    console.log(arr,typeof(tmax),arr[i],'max')
                    tmax = arr[i]
                }
            }
            // console.log(max,'max')
            return tmax
            },

        }
    
}
</script>

<style lang="scss">
.his_box{ /*盒子*/
            // width: 400px;
            // height: 220px;
            // border: solid 1px #1E90FF;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .his_box>div{
            text-align: center;
        }
        .histogram{ /*直方图*/
            display: flex;
            flex-direction: column;
        }
        .histogram>div{ /*一条图块*/
            height: 4px;
            width: 60px; /*100%时的块宽度*/
            line-height: 4px;
            font-size: 4px;
            text-align: right;
            margin-bottom: 1px;
            display: flex;
        }
        .histogram>div:nth-child(n+4) div{ /*图块颜色*/
            background-color: #f80511;
        }
        .histogram>div:nth-child(-n+5) div{
            background-color: #1f7526;
        }
        // .histogram>div:nth-child(3n+2) div{
        //     background-color: #F0AD4E;
        // }
        // .histogram>div:nth-child(1) div{
        //     flex: 0 0 50%; /*20为100%，50%就是10*/
        // }
        // .histogram>div:nth-child(2) div{
        //     flex: 0 0 40%; /*8/20*/
        // }
        // .histogram>div:nth-child(3) div{
        //     flex: 0 0 75%; /*15/20*/
        // }
        // .histogram>div:nth-child(4) div{
        //     flex: 0 0 60%; /*12/20*/
        // }
        // .histogram>div:nth-child(5) div{
        //     flex: 0 0 25%; /*5/20*/
        // }


</style>