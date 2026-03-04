<template>
    <div :class="['sidebar d-none d-lg-flex flex-column flex-shrink-0 bg-dark', collapsed ? 'sidebar--collapsed' : '']">
        <!-- Brand -->
        <router-link to="/" class="sidebar__brand d-flex align-items-center text-white text-decoration-none px-3">
            <i class="bi bi-layers-fill fs-4"></i>
            <span class="sidebar__brand-text ms-2 fw-semibold">Laravel App</span>
        </router-link>

        <hr class="text-secondary my-0">

        <!-- Nav items -->
        <ul class="nav nav-pills flex-column mb-auto px-2 pt-2">
            <NavItem
                v-for="item in navItems"
                :key="item.label"
                :item="item"
            />
        </ul>

        <hr class="text-secondary my-0">

        <!-- Footer -->
        <div class="px-3 py-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2 text-white sidebar__label">
                <i class="bi bi-person-circle fs-5"></i>
                <span class="small text-truncate" style="max-width: 120px;">
                    {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
                </span>
            </div>
            <button
                class="btn btn-sm btn-outline-secondary sidebar__label"
                title="Sign out"
                @click="handleLogout"
            >
                <i class="bi bi-box-arrow-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavItem from './NavItem.vue';
import { useNavItems } from '../composables/useNavItems.js';
import { useAuthStore } from '../stores/useAuthStore.js';

const router    = useRouter();
const authStore = useAuthStore();
const collapsed = ref(false);
const { navItems } = useNavItems();

async function handleLogout() {
    await authStore.logout();
    router.push('/login');
}
</script>

<style scoped>
.sidebar {
    width: 240px;
    min-height: 100vh;
    transition: width 0.25s ease;
    overflow: hidden;
}

.sidebar--collapsed {
    width: 68px;
}

.sidebar--collapsed .sidebar__label,
.sidebar--collapsed .sidebar__brand-text {
    display: none;
}

.sidebar--collapsed :deep(.nav-item__label) {
    display: none;
}

.sidebar__brand {
    height: 56px;
}
</style>
