import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/views/index.vue').default
    },
    {
      path: '/myself',
      name: 'myself',
      component: require('@/views/myself.vue').default,
      reloadOnSearch: true
    },
    {
      path: '/zhouyi',
      name: 'zhouyi',
      component: require('@/views/zhouyi.vue').default
    },
    {
      path: '/text',
      name: 'text',
      component: require('@/views/text.vue').default
    },
    {
      path: '/stock/:code',
      name: 'stock',
      component: require('@/views/stock.vue').default
    }
  ]
})
