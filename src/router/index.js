import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import Room from '@/components/Room';
import Screen from '@/components/Screen';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/room'
        },
        {
            path: '/room',
            name: 'room',
            component: Room
        },
        {
            path: '/screen',
            name: 'screen',
            component: Screen
        }
    ]
});
