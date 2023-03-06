const upColor = '#ec1c26';
const downColor = '#0da50d';
const baseColor = '#000000';

export function getUpColor() {
  return "color: " + upColor;
}

export function getDownColor() {
  return "color: " + downColor;
}

export function getBaseColor() {
  return "color: " + baseColor;
}

export function getColorByOne(baseNum) {
  let color = "color: ";
  if (baseNum > 0) {
    color = color + upColor;
  } else if (baseNum < 0) {
    color = color + downColor;
  } else {
    color = color + baseColor;
  }
  return color;
}

export function getColor(compareNum, baseNum) {
  let color = "color: ";
  if (compareNum === 0) {
    color = color + baseNum;
  } else if (compareNum > baseNum) {
    color = color + upColor;
  } else if (compareNum < baseNum) {
    color = color + downColor;
  } else {
    color = color + baseColor;
  }
  return color;
}

export function handleBSPan(BSPan) {
  //内盘和外盘
  let BSPanStr = '';
  if (BSPan > 1000000000) {
    BSPanStr = (BSPan / 100000000).toFixed(2) + '亿';
  } else if (BSPan > 1000000) {
    BSPanStr = (BSPan / 10000).toFixed(2) + '万';
  } else {
    BSPanStr = BSPan + '';
  }
  return BSPanStr;
}

export function handleVol(vol) {
  //成交量
  let volStr = '';
  if (vol > 100000000) {
    volStr = (vol / 100000000).toFixed(2) + '亿手';
  } else if (vol > 10000) {
    volStr = (vol / 10000).toFixed(2) + '万手';
  } else {
    volStr = vol + '手';
  }
  return volStr;
}

export function handleChartVol(vol) {
  //成交量
  let volStr = '';
  if (vol > 10000000000) {
    volStr = (vol / 10000000000).toFixed(2) + '亿手';
  } else if (vol > 1000000) {
    volStr = (vol / 1000000).toFixed(2) + '万手';
  } else {
    volStr = (vol / 100) + '手';
  }
  return volStr;
}

export function handleStockHeadVol(vol) {
  //成交量
  let volStr = '';
  if (vol > 100000000) {
    volStr = (vol / 100000000).toFixed(2) + '亿手';
  } else if (vol > 10000) {
    volStr = (vol / 10000).toFixed(2) + '万手';
  } else {
    volStr = vol + '手';
  }
  return volStr;
}

export function handleAmount(amount) {
  //成交额
  let amountStr = '';
  if (amount > 10000) {
    amountStr = (amount / 10000).toFixed(2) + '亿元';
  } else {
    amountStr = amount + '万元';
  }
  return amountStr;
}

//将 ts_code的格式，000001.SZ转换为sz000001，并且最后将数组转换为字符串返回
export function handleCode(codeList) {
  let newList = [];
  let temp = [];
  for (let i = 0; i < codeList.length; i++) {
    temp = codeList[i].split('.');
    newList.push(temp[1].toLowerCase() + temp[0]);
  }
  return newList.join();
}

export function changeToStockCode1(symbol) {
  let prefix = Number(symbol.substr(0, 1));
  let code = '';
  if (prefix === 0 || prefix === 3) {
    code = 'sz' + symbol;
  } else if (prefix === 6) {
    code = 'sh' + symbol;
  } else {
    code = symbol;
  }
  return code;
}

export function changeToStockCode2(symbol) {
  let prefix = Number(symbol.substr(0, 1));
  let code = '';
  if (prefix === 0 || prefix === 3) {
    code = '1' + symbol;
  } else if (prefix === 6) {
    code = '0' + symbol;
  } else {
    code = symbol;
  }
  return code;
}

//暂时只有market里面列出来的8种指数
export function changeToIndexCode1(symbol) {
  let prefix = Number(symbol.substr(0, 1));
  let code = '';
  if (prefix === 0) {
    code = 'sh' + symbol;
  } else if (prefix === 3) {
    code = 'sz' + symbol;
  } else {
    code = symbol;
  }
  return code;
}

//暂时只有market里面列出来的8种指数
export function changeToIndexCode2(symbol) {
  let prefix = Number(symbol.substr(0, 1));
  let code = '';
  if (prefix === 0) {
    code = '0' + symbol;
  } else if (prefix === 3) {
    code = '1' + symbol;
  } else {
    code = symbol;
  }
  return code;
}

// 将委托单状态从英文变为中文
export function handleOrderType(type) {
  if (type === 'sell') {
    return "卖出"
  } else if (type === 'buy') {
    return "买入"
  } else {
    return type
  }
}

// 将委托单的状态从数字含义转变为中文
export function handleOrderStation(station) {
  if (station === 0) {
    return "未成交"
  } else if (station === 1) {
    return "已成交"
  } else if (station === -1) {
    return "已撤单"
  } else if (station === -2) {
    return "已过期"
  } else {
    return station
  }
}

//处理stockInfo数据，返回五档交易信息（腾讯接口卖盘数据有时会出现错误信息，所以用了三个循环剔除掉错误信息）
export function getBSTradeInfo(stockInfo) {
  let BSTradeInfo = [];
  let tempPrice = [];
  let tempNum = [];
  for (let i = 9; i < 28; i = i + 2) {

    if (i >= 9 + 2 * 5 && Number(stockInfo[i]) <= Number(stockInfo[9])) {
      tempPrice.push(0);
      continue;
    }

    if (Number(stockInfo[i]) === 0) {
      tempPrice.push(0);
    } else {
      tempPrice.push(stockInfo[i]);
    }
  }
  for (let i = 10; i <= 28; i = i + 2) {
    if (Number(stockInfo[i]) === 0) {
      tempNum.push('——');
    } else {
      tempNum.push(stockInfo[i]);
    }
  }
  for (let i = 0; i < tempPrice.length; i++) {

    if (Number(tempPrice[i]) === 0) {
      BSTradeInfo.push('——');
      BSTradeInfo.push('——');
    } else {
      BSTradeInfo.push(tempPrice[i]);
      BSTradeInfo.push(tempNum[i]);
    }
  }
  return BSTradeInfo;
}

//处理stockInfo数据，返回五档交易信息颜色
export function getBSTradeInfoColor(preClose, BSTradeInfo) {
  let BSTradeInfoColor = [];
  for (let i = 0; i < BSTradeInfo.length; i = i + 2) {
    if (BSTradeInfo === '——') {
      BSTradeInfoColor.push(getBaseColor());
    } else {
      BSTradeInfoColor.push(getColor(Number(BSTradeInfo[i]), preClose));
    }
  }
  return BSTradeInfoColor;
}

//处理stockInfo数据，返回五档交易信息头部
export function getBSTradeInfoHead(stockInfo) {
  let BSTradeInfoHead = [];
  BSTradeInfoHead.push(stockInfo[1]); //股票名称
  BSTradeInfoHead.push(stockInfo[3]); //现价
  BSTradeInfoHead.push(stockInfo[32] + "%");  //现涨跌幅
  BSTradeInfoHead.push(stockInfo[31]);  //现涨跌额
  BSTradeInfoHead.push(getColor(Number(stockInfo[3]), Number(stockInfo[4]))); //现价颜色
  return BSTradeInfoHead;
}


// 处理sql的Timestamp字符串
export function handleTimestamp(timestamp, fmt) {
  let date = new Date(timestamp);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
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

//获取当前腾讯那边的实时逐笔成交最新页数，频率假设以最快每3秒一条交易记录，每页最多70条，即210
// (PS:最后没用上，因为腾讯那边不是实时的……)
// (PSS: 又用上了，腾讯那边抽风……)
export function getCurPage() {
  let date = new Date();
  let rate = 210;
  let hour = Number(date.getHours());
  let minute = Number(date.getMinutes());
  let second = Number(date.getSeconds());
  let min = 0;
  let max = Math.floor(4 * 60 * 60 / rate);
  let page;
  if (hour === 9 && minute <= 30) { //未开盘时间
    page = min;
    return page;
  } else if (hour <= 11 || (hour === 11 && minute <= 30)) {  //上午交易时间
    page = Math.floor(((hour - 9) * 60 * 60 + (minute - 30) * 60 + second) / rate);
    return page;
  } else if (hour >= 13 && hour <= 15) { //下午交易时间
    page = Math.floor((2 * 60 * 60 / rate) + (((hour - 13) * 60 * 60 + minute * 60 + second) / rate));
    return page;
  } else if ((hour === 11 && minute >= 30) || (hour >= 12 && hour <= 13)) {  //中午休盘时间
    page = Math.floor(2 * 60 * 60 / rate);
    return page;
  } else {  //收盘时间
    page = max;
    return page;
  }
}
