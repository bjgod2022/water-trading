// 行情数据适配器
import {adapers} from './adapers/'
import {charts} from './charts/'
import {KLINE_MAP,DEFAULT_ADAPER,DEFAULT_CHART} from '@/config/'

/**
 * 图表
 * @param {*} stock 股票对象
 * @param {*} kineType 图表类型，参考config/index.js KLINE_MAP字典
 */
export function klines(stock,kineType=KLINE_MAP.Hour){
    let _adaper=adapers[DEFAULT_ADAPER]
    let _chartAdaper=charts[DEFAULT_CHART]
    return new Promise((resolve,reject)=>{
        _adaper.klines[kineType](stock).then((_datas)=>{
            resolve(_chartAdaper.klines[kineType](stock,_datas,kineType))
        })
    }) 
}

/**
 * 大盘涨跌概况
 */
export function ranks(){
    let _adaper=adapers[DEFAULT_ADAPER]
    return _adaper.ranks()
}

/**
 * 指定股票详情行情
 * @param {*} code 股票代码，如sz002926
 */
export function hq(code){
    return adapers[DEFAULT_ADAPER].hq(code)
}

/**
 * 批量简要行情
 * @param {*} codes 批量行情
 */
export function shorts(codes){
    return adapers[DEFAULT_ADAPER].shorts(codes)
}

/**
 * 股票新闻/公告查询
 * @param {*} stock 股票对象
 * @param {*} noticeType 类型
 */
export function notices(stock,noticeType){
    return adapers[DEFAULT_ADAPER].notices(stock,noticeType)
}

/**
 * 排名榜
 */
export function tops(params){
    return adapers[DEFAULT_ADAPER].tops(params)
}

/**
 * 创建图表
 */
export function createKline(klineType,options={
    el:null,
    min:null,
    max:null,
    basic:null
}){
    let _chartAdaper=charts[DEFAULT_CHART]
    return _chartAdaper.creates[klineType](options)
}
//获取当前时间是否为可交易时间
export function ifCurTimeIsTradeTime() {
    let date = new Date();
    let day = Number(date.getDay());
    let hour = Number(date.getHours());
    let minute = Number(date.getMinutes());
    if (day === 0 || day === 6) { //周日或周六
      return false;
    } else if (hour < 9 || (hour === 9 && minute < 15)) { //早上未开盘
      return false;
    } else if ((hour === 11 && minute > 30) || (hour > 11 && hour < 13)) {  //中午休盘
      return false;
    } else if (hour >= 15 && minute > 5) { //下午收盘
      return false;
    } else {
      return true;
    }
  }