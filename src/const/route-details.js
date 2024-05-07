import { HomeFilled, StarFilled } from '@element-plus/icons-vue'

const ROUTE_NAMES = Object.freeze({
  HOME: 'home',
  FAVORITES: 'favorites',
})

const ROUTE_PATHS = Object.freeze({
  [ROUTE_NAMES.HOME]: '/home',
  [ROUTE_NAMES.FAVORITES]: '/favorites',
})

const ROUTE_ICONS = Object.freeze({
  [ROUTE_NAMES.HOME]: HomeFilled,
  [ROUTE_NAMES.FAVORITES]: StarFilled,
})

export { ROUTE_ICONS, ROUTE_PATHS, ROUTE_NAMES }
