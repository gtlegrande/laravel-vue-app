<template>
    <div class="offcanvas offcanvas-start bg-dark text-white" tabindex="-1" id="mobileSidebar">
        <div class="offcanvas-header border-bottom border-secondary">
            <h5 class="offcanvas-title text-white">Laravel App</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body px-0 d-flex flex-column">
            <ul class="nav nav-pills flex-column px-2 flex-grow-1">
                <NavItem
                    v-for="item in navItems"
                    :key="item.label"
                    :item="item"
                />
            </ul>

            <hr class="text-secondary mx-3 my-0">

            <!-- Footer -->
            <div class="px-3 py-3 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2 text-white">
                    <i class="bi bi-person-circle fs-5"></i>
                    <span class="small text-truncate" style="max-width: 140px;">
                        {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
                    </span>
                </div>
                <button
                    class="btn btn-sm btn-outline-secondary"
                    title="Sign out"
                    @click="handleLogout"
                >
                    <i class="bi bi-box-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import NavItem from './NavItem.vue';
import { useNavItems } from '../composables/useNavItems.js';
import { useAuthStore } from '../stores/useAuthStore.js';

const router    = useRouter();
const authStore = useAuthStore();
const { navItems } = useNavItems();

async function handleLogout() {
    await authStore.logout();
    router.push('/login');
}
</script>

