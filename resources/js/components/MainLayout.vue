<template>
    <div class="d-flex">
        <!-- Sidebar -->
        <Sidebar />

        <!-- Main content -->
        <div class="flex-grow-1 d-flex flex-column">
            <!-- Top navbar (mobile only) -->
            <nav class="navbar navbar-light bg-white border-bottom px-3 d-lg-none">
                <button
                    class="navbar-toggler border-0 me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileSidebar"
                    aria-controls="mobileSidebar"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <router-link to="/" class="navbar-brand mb-0 h6 fw-semibold text-muted text-decoration-none">Some App</router-link>
            </nav>

            <!-- Page content -->
            <main class="p-4 bg-light flex-grow-1">
                <router-view />
            </main>
        </div>
    </div>

    <MobileSidebar />
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import MobileSidebar from './MobileSidebar.vue';
</script>

<style scoped>
main {
    min-height: calc(100vh - 56px);
}
</style>
