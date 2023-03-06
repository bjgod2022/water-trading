# 周易选股

周易选股，六壬应用，五行推演，股票，a 股，预测
如果你只想看盘，那就算了
page1：市场预留
page2：本地参数服务 自选
page3，网络参数服务 周易

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

### Compiles and minifies for production

```
yarn b
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

##

首先感谢 vue-m-stock
stockviewertool

一：公开 api 数据对接分时数据
现有轮子
快速股票搜索

丝滑切灵活的拖拽。
面板可自定义中
对接了部分日线数据

自定义右键无法截图。

Mini 分时图，数据源没有找到 3000 毫秒延时内的，有满足条件的，但是对接有 bug，
可自定义 websocket，对接 wind
此文档删除了 wind 对接。
详情页，毫无完善。只有概图。
只定义了 min，quit 需要自定义。

二：（应对策略多为日周期，交易为分时周期）多周期与分时数据互动
现有轮子
数据互动需要自定义后端服务

三：消息分析，情绪分析对接 websocket
部分轮子

四：自定义数据分析
部分轮子

五：自定义交易模型
现有轮子

六：api 及 ui，多平台完善 win-HD 版本完善
