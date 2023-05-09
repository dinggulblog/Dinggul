import { createRouter, createWebHistory } from 'vue-router'
import { trackRouter } from 'vue-gtag-next'
import store from '../store/index'
import Home from '../views/Home.vue'
import Posts from '../views/post/Posts.vue'
import Search from '../views/post/Search.vue'
import NotFound from '../views/NotFound.vue'

const Post = () => import(/* webpackChunkName: "post" */ '../views/post/Post.vue')
const Editor = () => import(/* webpackChunkName: "editor" */ '../views/post/Editor.vue')
const Profile = () => import(/* webpackChunkName: "profile" */ '../views/auth/Profile.vue')
const FindAccount = () => import(/* webpackChunkName: "findAccount" */ '../views/auth/FindAccount.vue')
const ResetPassword = () => import(/* webpackChunkName: "resetPassword" */ '../views/auth/ResetPassword.vue')
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Dashboard.vue')

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/auth/profile/:nickname', name: 'profile', component: Profile, meta: { title: 'Profile' } },
  { path: '/auth/find', name: 'findAccount', component: FindAccount, meta: { title: 'FindAccount' } },
  { path: '/auth/pwd-reset', name: 'resetPassword', component: ResetPassword, meta: { title: 'ResetPassword' } },
  { path: '/posts/:main/:sub?', name: 'posts', component: Posts, props: true, meta: { title: 'Posts' } },
  { path: '/post/:postId', name: 'post', component: Post, props: true, meta: { title: 'Post' } },
  { path: '/editor', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/search', name: 'search', component: Search, props: true, meta: { title: 'Search' } },
  { path: '/dashboard/:section', name: 'dashboard', component: Dashboard, props: true, meta: { title: 'Dashboard', requiredAuth: true } },
  { path: '/:catchAll(.*)+', name: 'notfound', component: NotFound, meta: { title: 'NotFoundError 404!' } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' })
  },
})

router.beforeEach(async (to, from, next) => {
  try {
    if (!store.state.menu.menus) {
      await store.dispatch('menu/getMenus')
    }

    if (to.name === 'posts') {
      store.commit('menu/SET_CATEGORY', '전체')
    }

    if (to.params.main) {
      store.commit('menu/SET_CURRENT_MENUS', { main: to.params.main, sub: to.params.sub })
    }

    if (!to.meta.requiredAuth) {
      return next()
    }

    // Admin route (required authentication)
    if (!store.state.auth.isAdmin) {
      return next({ name: 'home' })
    } 
    if (store.state.auth.isValidAdmin) {
      return next()
    }

    // If localStorage set isAdmin -> Validate it from server once
    const { user } = await store.dispatch('auth/getAccount')
    if (!user || !user.roles.includes('ADMIN')) {
      return next({ name: 'home' })
    }

    store.commit('auth/SET_ADMIN')
    return next()
  } catch (error) {
    next(error)
  }
})

router.afterEach((to, from, failure) => {
  if (to.name !== 'post') {
    document.title = to.params.sub
      ? to.params.main.replace(/^[a-z]/, (char) => char.toUpperCase()) + ' / ' + to.params.sub.replace(/^[a-z]/, (char) => char.toUpperCase()) + ' - DINGGUL'
      : to.params.main
      ? to.params.main.replace(/^[a-z]/, (char) => char.toUpperCase()) + ' - DINGGUL'
      : to.meta.title
      ? to.meta.title + ' - DINGGUL'
      : document.title
  }
})

trackRouter(router, {
  useScreenview: true,
})

export default router
