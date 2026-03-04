<template>
    <li class="nav-item mb-1">
        <router-link
            :to="item.route"
            class="nav-link d-flex align-items-center gap-2 text-white link-light"
            active-class="active"
            exact-active-class="active"
            @click="closeMobileSidebar"
        >
            <i :class="['bi', item.icon, 'fs-5']"></i>
            <span class="nav-item__label">{{ item.label }}</span>
        </router-link>
    </li>
</template>

<script setup>
import { Offcanvas } from 'bootstrap';

defineProps({
    item: {
        type: Object,
        required: true,
    },
});

function closeMobileSidebar() {
    const el = document.getElementById('mobileSidebar');
    if (!el) return;
    const instance = Offcanvas.getInstance(el);
    if (instance) instance.hide();
}
</script>

<style scoped>
.nav-link {
    border-radius: 0.375rem;
    white-space: nowrap;
}

.nav-link.active {
    background-color: #0d6efd;
}

.nav-link:not(.active):hover {
    background-color: rgba(255, 255, 255, 0.08);
}
</style>
