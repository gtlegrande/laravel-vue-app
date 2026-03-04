<template>
    <div>
        <h2 class="mb-4">Leagues</h2>
        <div class="card shadow-sm">
            <div class="card-body">
                <p class="text-muted">No leagues yet. Create your first league to get started.</p>
                <AppButton variant="primary">
                    <i class="bi bi-plus-lg me-1"></i> New League
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import AppButton from '../components/AppButton.vue';
</script>
