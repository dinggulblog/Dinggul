import { computed } from 'vue'
import { useMedia } from '../../common/mediaQuery.js'

const MOBILE_LIST = /Android|Mobile|iP(hone|od|ad)|BlackBerry|I EMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/

const isMobileDevices = computed(() => navigator.userAgent.match(MOBILE_LIST) === null ? false : true)

const isDesktop = useMedia('(min-width: 1200px)')

const isMobileAndTablet = useMedia('only screen and (max-width: 1199px)')

const isTabletLandScape = useMedia('(min-width: 1024px) and (max-width: 1199px)')

const isTablet = useMedia('(min-width: 768px) and (max-width: 1023px)')

const isMobile = useMedia('only screen and (max-width: 767px)')

export default {
  isMobileDevices,
  isDesktop,
  isMobileAndTablet,
  isTabletLandScape,
  isMobile,
  isTablet
}