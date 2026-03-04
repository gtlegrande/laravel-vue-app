import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAuthenticated = computed(() => user.value !== null);

    /**
     * Fetch a CSRF cookie from Sanctum then attempt login.
     */
    async function login(email, password) {
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/api/login', { email, password });
        user.value = response.data.data;
    }

    /**
     * Log out and clear local state.
     */
    async function logout() {
        await axios.post('/api/logout');
        user.value = null;
    }

    /**
     * Check who is currently logged in (called on app boot).
     * Returns silently if unauthenticated.
     */
    async function fetchUser() {
        try {
            const response = await axios.get('/api/user');
            user.value = response.data.data;
        } catch {
            user.value = null;
        }
    }

    return { user, isAuthenticated, login, logout, fetchUser };
});

