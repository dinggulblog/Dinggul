import { createStore } from 'vuex'
import authModule from './modules/auth'
import mailModule from './modules/mail'
import menuModule from './modules/menu'
import postModule from './modules/post'
import draftModule from './modules/draft'
import commentModule from './modules/comment'
import loadingModule from './modules/loading'
import openaiModule from './modules/openai'



export default createStore({
  modules: {
    auth: authModule,
    mail: mailModule,
    menu: menuModule,
    post: postModule,
    draft: draftModule,
    comment: commentModule,
    loading: loadingModule,
    openai: openaiModule,
  },
})
