<template>
    <!-- Shown briefly on first load while the router guard resolves the session -->
    <div v-if="loading" class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading…</span>
        </div>
    </div>

    <template v-else>
        <MainLayout v-if="authStore.isAuthenticated" />
        <router-view v-else />
    </template>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/useAuthStore.js';
import MainLayout from './components/MainLayout.vue';

const authStore = useAuthStore();
const router    = useRouter();
const loading   = ref(true);

// Hide the spinner once the first navigation (which includes fetchUser) completes
router.isReady().then(() => {
    loading.value = false;
});
</script>
