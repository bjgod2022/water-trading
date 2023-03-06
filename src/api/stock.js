import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'

export function getMinuteStock(stockCode) {
  return axios.request({
    url: 'https://bird.ioliu.cn/v2?url=http://img1.money.126.net/data/hs/time/today/' + stockCode + '.json',
    method: 'get'
  })
}

 export function getRecordInfo(query) {
   return axios.request({
     url: 'https://bird.ioliu.cn/v2?url=http://stock.gtimg.cn/data/index.php?appn=detail&action=data&c=' + query.stockCode + '&p=' + query.page,
     method: 'get'
   })
 }

//export function getRecordInfo1(query) {
//  return axios.request({
//    url: 'https://bird.ioliu.cn/v2?url=http://qt.gtimg.cn/?q=s_dd' + query.stockCode + '&_=' + query.nowTimes,
//    method: 'get'
//  })
//}

export function getStockInfo(stockCode) {
  return axios.request({
    url: 'http://sqt.gtimg.cn/q=' + stockCode,
    method: 'get'
  })
}

export function getIndexKlineInfo(query) {
  return request({
    url: '/stock/getIndexKlineInfo',
    method: 'get',
    params: query
  })
}

export function getStockKlineInfo(query) {
  return request({
    url: '/stock/getStockKlineInfo',
    method: 'get',
    params: query
  })
}

export function getQueryStock(query) {
  return request({
    url: '/stock/getQueryStock',
    method: 'get',
    params: query
  })
}

export function getStockList(query) {
  return request({
    url: '/stock/getStockList',
    method: 'get',
    params: query
  })
}

export function getStockBasicInfo(stockCode) {
  return request({
    url: '/stock/getStockBasicInfo',
    method: 'get',
    params: stockCode
  })
}

export function getUserAllOptionalCode(token) {
  return request({
    url: '/stock/getUserAllOptionalCode',
    method: 'get',
    params: {token}
  })
}

export function getUserOptionalList(query) {
  return request({
    url: '/stock/getUserOptionalList',
    method: 'get',
    params: query
  })
}

export function updateUserOptional(data) {
  return request({
    url: '/stock/updateUserOptional',
    method: 'post',
    data:  qs.stringify(data)
  })
}

export function getQueryOptionalStock(query) {
  return request({
    url: '/stock/getQueryOptionalStock',
    method: 'get',
    params: query
  })
}
