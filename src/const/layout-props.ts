const PROP_NAMES = Object.freeze({
  ROUTE_TITLE: 'routeTitle',
})

const PROP_DEFINITIONS = Object.freeze({
  [PROP_NAMES.ROUTE_TITLE]: {
    type: String,
    required: true,
  },
})

export { PROP_NAMES, PROP_DEFINITIONS }
