import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router'
import { useAppStore } from './app/store'
import './styles/tokens.css'
import './styles/base.css'
import './styles/utilities.css'
import './styles/catalogue.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)
const refreshPromise = useAppStore(pinia).refresh()
app.mount('#app')

const launchScreen = document.querySelector<HTMLElement>('#renew404-launch')
const standaloneNavigator = navigator as Navigator & { standalone?: boolean }
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const minimumLaunchDuration = reduceMotion ? 250 : isStandalone ? 2200 : 500

void Promise.allSettled([refreshPromise, router.isReady()]).then(() => {
  const remaining = Math.max(0, minimumLaunchDuration - performance.now())
  window.setTimeout(() => {
    document.documentElement.classList.remove('launch-pending')
    launchScreen?.classList.add('is-leaving')
    window.setTimeout(() => launchScreen?.remove(), reduceMotion ? 10 : 440)
  }, remaining)
})
