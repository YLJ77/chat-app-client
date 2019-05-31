import Vue from 'vue'
import Router from 'vue-router'
import Chat from './views/chat.vue'
import Join from './views/join'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'join',
            component: Join
        },
        {
            path: '/chat/:name/:room',
            name: 'chat',
            component: Chat
        }
    ]
})
