import Vue from 'vue'
import App from './App.vue'
// import store from './store'
import store from './store'
import router from './router'
import axios from 'axios'
import Toasted from 'vue-toasted' // 底部提示弹窗
import {comparePrice, transVolume, transDate, transMarketName} from './libs/constant' // 公共方法
import less from 'less'
// import {Carousel,Icon,Table, TableColumn, Input, Select, Option, Form, FormItem, Dialog, Button, Loading} from 'element-ui' // 按需加载
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { mixins } from './mixins/'
import './scss/variable.scss'
import "charts.css";

// import './assets/iconfont/iconfont.css'
// import '@/common/scss/app.scss'
// 
import SvgIcon from '@/components/SvgIcon';
import './assets/icon/iconfont';


Vue.component('svg-icon', SvgIcon);
const requireAll = reqireContext => reqireContext.keys().map(reqireContext);
const req = require.context('./svg', false, /\.svg$/);
requireAll(req);


// 引用app.scss
// import './common/scss/app.scss'
// element-ui 按需引用
// Vue.use(Carousel)
// Vue.use(Icon)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Input)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Dialog)
// Vue.use(Button)
// Vue.use(Loading)
Vue.use(Toasted)
Vue.use(ElementUI);
// Vue.use(axios)
Vue.mixin(mixins)
// 全局绑定公共方法
Vue.prototype.comparePrice = comparePrice
Vue.prototype.transVolume = transVolume
Vue.prototype.transDate = transDate
Vue.prototype.transMarketName = transMarketName

axios.defaults.headers.get['Content-Type'] = 'text/plain'
Vue.http = Vue.prototype.$http = axios
Vue.http = Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.config.productionTip = false
Vue.use(less)
new Vue({
  components: {App},
  store,
  // stores,
  router,
  render: h => h(App)
}).$mount('#app')
