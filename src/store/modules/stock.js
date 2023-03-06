import {
  getMinuteStock, getStockInfo, getIndexKlineInfo, getQueryStock, getStockList,
  getStockBasicInfo, updateUserOptional, getUserOptionalList, getUserAllOptionalCode, getQueryOptionalStock,
  getStockKlineInfo, getRecordInfo
} from "../../api/stock";

const getDefaultState = () => {
  return {
    stockName: '平安银行',
    stockCode1: 'sz000001',
    stockCode2: '1000001',
    indexCode1: 'sh000001',
    indexCode2: '0000001'
  };
}

const state = getDefaultState()

const mutations = {
  SET_STOCK_NAME: (state, stockName) => {
    sessionStorage.setItem("stockName", stockName); //添加到sessionStorage
    state.stockName = stockName
  },
  SET_STOCK_CODE1: (state, stockCode1) => {
    sessionStorage.setItem("stockCode1", stockCode1); //添加到sessionStorage
    state.stockCode1 = stockCode1
  },
  SET_STOCK_CODE2: (state, stockCode2) => {
    sessionStorage.setItem("stockCode2", stockCode2); //添加到sessionStorage
    state.stockCode2 = stockCode2
  },
  SET_INDEX_CODE1: (state, indexCode1) => {
    sessionStorage.setItem("indexCode1", indexCode1); //添加到sessionStorage
    state.indexCode1 = indexCode1
  },
  SET_INDEX_CODE2: (state, indexCode2) => {
    sessionStorage.setItem("indexCode2", indexCode2); //添加到sessionStorage
    state.indexCode2 = indexCode2
  }
}

const actions = {
  getMinuteStock({commit}, stockCode) {
    //console.log("getMinuteStock-start");
    //console.log(stockCode);
    return new Promise((resolve, reject) => {
      getMinuteStock(stockCode).then(response => {
        //console.log(response);
        //console.log("getMinuteStock-end");
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getRecordInfo({commit}, query) {
    //console.log("getRecordInfo-start");
    //console.log(stockCode);
    return new Promise((resolve, reject) => {
      getRecordInfo(query).then(response => {
        //console.log(response);
        //console.log("getRecordInfo-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getStockInfo({commit}, stockCode) {
    //console.log("getStockInfo-start");
    //console.log(stockCode);
    return new Promise((resolve, reject) => {
      getStockInfo(stockCode).then(response => {
        //console.log(response);
        //console.log("getStockInfo-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getIndexKlineInfo({commit}, query) {
    //console.log("getIndexKline-start");
    //console.log(query);
    return new Promise((resolve, reject) => {
      getIndexKlineInfo(query).then(response => {
        //console.log(response);
        //console.log("getIndexKline-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getStockKlineInfo({commit}, query) {
    //console.log("getStockKlineInfo-start");
    //console.log(query);
    return new Promise((resolve, reject) => {
      getStockKlineInfo(query).then(response => {
        //console.log(response);
        //console.log("getStockKlineInfo-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getQueryStock({commit}, query) {
    //console.log("getQueryStock-start");
    return new Promise((resolve, reject) => {
      getQueryStock({query: query}).then(response => {
        //console.log(response);
        //console.log("getQueryStock-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getStockList({commit}, query) {
    //console.log("getQueryStock-start");
    return new Promise((resolve, reject) => {
      getStockList(query).then(response => {
        //console.log(response);
        //console.log("getQueryStock-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getStockBasicInfo({commit}, stockCode) {
    console.log("getStockBasicInfo-start");
    return new Promise((resolve, reject) => {
      getStockBasicInfo({symbol: stockCode}).then(response => {
        console.log(response);
        console.log("getStockBasicInfo-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  saveStockCodeToIndividual({commit}, query) {
    commit('SET_STOCK_NAME', query.stockName);
    commit('SET_STOCK_CODE1', query.stockCode1);
    commit('SET_STOCK_CODE2', query.stockCode2);
  },

  saveStockCodeToIndex({commit}, query) {
    commit('SET_INDEX_CODE1', query.indexCode1);
    commit('SET_INDEX_CODE2', query.indexCode2);
  },

  getUserAllOptionalCode({commit}, token) {
    console.log("getUserOptional-start")
    return new Promise((resolve, reject) => {
      getUserAllOptionalCode(token).then(response => {
        console.log(response)
        console.log("getUserOptional-end")
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserOptionalList({commit}, query) {
    console.log("getUserOptionalList-start")
    console.log(query)
    return new Promise((resolve, reject) => {
      getUserOptionalList(query).then(response => {
        console.log(response)
        console.log("getUserOptionalList-end")
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUserOptional({commit}, data) {
    console.log("updateUserOptional-start")
    console.log(data)
    return new Promise((resolve, reject) => {
      updateUserOptional(data).then(response => {
        console.log(response)
        console.log("updateUserOptional-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getQueryOptionalStock({commit}, query) {
    //console.log("getQueryOptionalStock-start");
    return new Promise((resolve, reject) => {
      getQueryOptionalStock(query).then(response => {
        //console.log(response);
        //console.log("getQueryOptionalStock-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
