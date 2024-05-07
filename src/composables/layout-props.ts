import { computed } from 'vue'
import { PROP_NAMES } from '@/const/layout-props'

export const useLayoutProps = (props) =>
  Object.fromEntries(
    Object.values(PROP_NAMES).map((prop) => [prop, computed(() => props[prop])])
  )
