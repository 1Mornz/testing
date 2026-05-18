import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './styles.css';
import LandingPage from './views/LandingPage.vue';
import SetupPage from './views/SetupPage.vue';
import DashboardPage from './views/DashboardPage.vue';
import RequestDetailPage from './views/RequestDetailPage.vue';
import PublicQuotePage from './views/PublicQuotePage.vue';
import SuccessPage from './views/SuccessPage.vue';
import CancelPage from './views/CancelPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/setup', component: SetupPage },
    { path: '/dashboard', component: DashboardPage },
    { path: '/dashboard/requests/:id', component: RequestDetailPage },
    { path: '/q/:slug', component: PublicQuotePage },
    { path: '/success', component: SuccessPage },
    { path: '/cancel', component: CancelPage },
  ],
});

createApp(App).use(router).mount('#app');
