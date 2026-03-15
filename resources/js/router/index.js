import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore.js';
import DashboardPage from '../pages/DashboardPage.vue';
import UsersPage     from '../pages/UsersPage.vue';
import CompaniesPage from '../pages/CompaniesPage.vue';
import LeaguesPage   from '../pages/LeaguesPage.vue';
import SettingsPage  from '../pages/SettingsPage.vue';
import LoginPage     from '../pages/LoginPage.vue';

const routes = [
    { path: '/login',     component: LoginPage,     meta: { requiresGuest: true } },
    { path: '/',          component: DashboardPage, meta: { requiresAuth: true } },
    { path: '/users',     component: UsersPage,     meta: { requiresAuth: true } },
    { path: '/companies', component: CompaniesPage, meta: { requiresAuth: true } },
    { path: '/leagues',   component: LeaguesPage,   meta: { requiresAuth: true } },
    { path: '/settings',  component: SettingsPage,  meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

let bootstrapped = false;

router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    // Only call the server once per page load to restore the session
    if (! bootstrapped) {
        await authStore.fetchUser();
        bootstrapped = true;
    }

    if (to.meta.requiresAuth && ! authStore.isAuthenticated) {
        return { path: '/login' };
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        return { path: '/' };
    }
});

export default router;
