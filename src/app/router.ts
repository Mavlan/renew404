import { createRouter, createWebHistory } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import DashboardView from '../views/DashboardView.vue'
import ServicesView from '../views/ServicesView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import SettingsView from '../views/SettingsView.vue'
import ServiceDetailView from '../views/ServiceDetailView.vue'
import ServiceEditorView from '../views/ServiceEditorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppShell,
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'services', name: 'services', component: ServicesView },
        { path: 'services/new', name: 'service-new', component: ServiceEditorView },
        { path: 'services/:id', name: 'service-detail', component: ServiceDetailView },
        { path: 'services/:id/edit', name: 'service-edit', component: ServiceEditorView },
        { path: 'statistics', name: 'statistics', component: StatisticsView },
        { path: 'settings', name: 'settings', component: SettingsView },
      ],
    },
  ],
})

export default router
