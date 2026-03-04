<template>
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="card shadow-sm" style="width: 100%; max-width: 420px;">
            <div class="card-body p-4 p-md-5">
                <!-- Brand -->
                <div class="text-center mb-4">
                    <i class="bi bi-layers-fill fs-1 text-primary"></i>
                    <h4 class="fw-semibold mt-2 mb-0">Laravel App</h4>
                    <p class="text-muted small">Sign in to your account</p>
                </div>

                <!-- Error alert -->
                <div v-if="errorMessage" class="alert alert-danger py-2 small" role="alert">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleLogin" novalidate>
                    <FormInput
                        id="email"
                        v-model="email"
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        :error="errors.email"
                        required
                    />

                    <FormInput
                        id="password"
                        v-model="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        :error="errors.password"
                        required
                        class="mt-3"
                    />

                    <AppButton
                        type="submit"
                        variant="primary"
                        class="w-100 mt-4"
                        :disabled="loading"
                    >
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        {{ loading ? 'Signing in…' : 'Sign In' }}
                    </AppButton>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore.js';
import FormInput from '../components/FormInput.vue';
import AppButton from '../components/AppButton.vue';

const router      = useRouter();
const authStore   = useAuthStore();

const email        = ref('');
const password     = ref('');
const loading      = ref(false);
const errorMessage = ref('');
const errors       = ref({ email: '', password: '' });

async function handleLogin() {
    errors.value = { email: '', password: '' };
    errorMessage.value = '';

    // Frontend validation
    let valid = true;
    if (! email.value) {
        errors.value.email = 'Email address is required.';
        valid = false;
    }
    if (! password.value) {
        errors.value.password = 'Password is required.';
        valid = false;
    }
    if (! valid) return;

    loading.value = true;
    try {
        await authStore.login(email.value, password.value);
        router.push('/');
    } catch (err) {
        if (err.response?.status === 422) {
            const serverErrors = err.response.data?.errors ?? {};
            errors.value.email    = serverErrors.email?.[0]    ?? '';
            errors.value.password = serverErrors.password?.[0] ?? '';
            if (! errors.value.email && ! errors.value.password) {
                errorMessage.value = err.response.data?.message ?? 'Invalid credentials.';
            }
        } else {
            errorMessage.value = 'Something went wrong. Please try again.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

