import _index from './index/index.vue'
import _search from './search/search.vue'
import _hqBase from './hq/hq-base.vue'
import _hqExtend from './hq/hq-extend.vue'
import _hqChart from './hq/hq-chart.vue'
import _hqChartMin from './hq/hq-chart-min.vue'


import _hqChartCan from './hq/hq-chart-can.vue'
import _loadingList from './loading-list/loading-list.vue'
import _hqChartDay from './hq/hq-chart-day.vue'


export const index = _index
export const hqBase = _hqBase
export const hqExtend = _hqExtend
export const hqChart = _hqChart
export const hqChartCan = _hqChartCan
export const hqChartDay = _hqChartDay
export const hqChartMin = _hqChartMin

export const search = _search
export const loadingList = _loadingList

// 组件导入
export function $components (components) {
    let _components = {}
    if (components instanceof Array) {
        components.forEach(component => {
            _components[component.name] = component
        })
    } else {
        _components[component.name] = component
    }
    return _components
}