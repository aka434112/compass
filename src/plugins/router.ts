import { createRouter, createWebHistory } from 'vue-router'

import { addVueI18nLocaleMessages } from './'
import { sidebarRouteLabel } from '@/composables/navigation'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/const/route-details'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Redirect to the home page by default
    {
      path: '',
      redirect: {
        name: ROUTE_NAMES.HOME,
      },
    },
    {
      path: ROUTE_PATHS[ROUTE_NAMES.HOME],
      name: ROUTE_NAMES.HOME,
      component: () => import('@/views/home.vue'),
      beforeEnter: async (to, from, next) => {
        await addVueI18nLocaleMessages('home')
        next()
      },
      meta: {
        title: (t) => sidebarRouteLabel(t, ROUTE_NAMES.HOME),
      },
    },
  ],
})

export default [router, {}]
