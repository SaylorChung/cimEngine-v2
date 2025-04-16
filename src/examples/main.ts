import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import '../../public/Widgets/widgets.css'

// 创建并挂载Vue应用
createApp(App).use(ElementPlus).mount('#app')
