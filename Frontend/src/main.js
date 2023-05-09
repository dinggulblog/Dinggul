import { config } from 'dotenv'
import { createApp } from 'vue'
import VueGtag from 'vue-gtag-next'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'
import MediaQuery from './plugins/MediaQuery'
import MyHeader from './components/global/MyHeader.vue'
import Toast from './components/global/ToastMessage.vue'
import Dialog from './components/global/Dialog.vue'
import Account from './components/global/Account.vue'
import Contact from './components/global/ContactUs.vue'
import TextInput from './components/ui/TextInput.vue'
import TextArea from './components/ui/TextArea.vue'
import Checkbox from './components/ui/Checkbox.vue'
import Button from './components/ui/Button.vue'
import Ico from './components/ui/Ico.vue'
import Image from './components/ui/Image.vue'
import Kebab from './components/ui/Kebab.vue'
import PopupModal from './components/ui/PopupModal.vue'

config() // dotenv config
setupInterceptors(store) // create axios instance

const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(VueDOMPurifyHTML)
  .use(MediaQuery)
  .use(VueGtag, { config: { id: process.env.VUE_APP_GA_MEASUREMENT_ID } }, router)
  .component('Ico', Ico)
  .component('Image', Image)
  .component('Kebab', Kebab)
  .component('Button', Button)
  .component('Checkbox', Checkbox)
  .component('TextArea', TextArea)
  .component('TextInput', TextInput)
  .component('PopupModal', PopupModal)
  .component('MyHeader', MyHeader)
  .component('Account', Account)
  .component('Toast', Toast)
  .component('Dialog', Dialog)
  .component('Contact', Contact)
  .mount('#app')
