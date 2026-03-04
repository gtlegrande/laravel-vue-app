<template>
    <BaseModal :id="modalId" :title="isEditing ? 'Edit User' : 'Add User'" ref="modalRef" @hidden="resetForm">
        <UserForm :form="form" :errors="errors" :is-editing="isEditing" @submit="submit" />

        <template #footer>
            <AppButton variant="secondary" @click="modalRef.close()">Cancel</AppButton>
            <AppButton variant="primary" :loading="saving" @click="submit">
                {{ isEditing ? 'Save Changes' : 'Create User' }}
            </AppButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import BaseModal  from '../BaseModal.vue';
import UserForm   from './UserForm.vue';
import AppButton  from '../AppButton.vue';

const props = defineProps({
    createUser: { type: Function, required: true },
    updateUser: { type: Function, required: true },
});

const emit = defineEmits(['created', 'updated']);

const modalRef    = ref(null);
const saving      = ref(false);
const errors      = ref({});
const editingUser = ref(null);

const isEditing = computed(() => editingUser.value !== null);
const modalId   = 'userFormModal';

const form = reactive({
    first_name:            '',
    last_name:             '',
    email:                 '',
    password:              '',
    password_confirmation: '',
});

function validate() {
    const e = {};
    if (!form.first_name.trim()) e.first_name = ['First name is required.'];
    if (!form.last_name.trim())  e.last_name  = ['Last name is required.'];
    if (!form.email.trim())      e.email      = ['Email is required.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = ['Please enter a valid email address.'];
    }
    if (!isEditing.value) {
        if (!form.password)                e.password = ['Password is required.'];
        else if (form.password.length < 8) e.password = ['Password must be at least 8 characters.'];
        if (!form.password_confirmation)   e.password_confirmation = ['Please confirm your password.'];
        else if (form.password !== form.password_confirmation) {
            e.password_confirmation = ['Passwords do not match.'];
        }
    } else if (form.password) {
        if (form.password.length < 8)     e.password = ['Password must be at least 8 characters.'];
        if (!form.password_confirmation)  e.password_confirmation = ['Please confirm your password.'];
        else if (form.password !== form.password_confirmation) {
            e.password_confirmation = ['Passwords do not match.'];
        }
    }
    return e;
}

function resetForm() {
    editingUser.value          = null;
    form.first_name            = '';
    form.last_name             = '';
    form.email                 = '';
    form.password              = '';
    form.password_confirmation = '';
    errors.value               = {};
}

function open(user = null) {
    editingUser.value = user;
    if (user) {
        form.first_name            = user.first_name;
        form.last_name             = user.last_name;
        form.email                 = user.email;
        form.password              = '';
        form.password_confirmation = '';
        errors.value               = {};
    }
    modalRef.value.open();
}

defineExpose({ open });

async function submit() {
    errors.value = validate();
    if (Object.keys(errors.value).length) return;

    saving.value = true;
    try {
        if (isEditing.value) {
            const user = await props.updateUser(editingUser.value.id, { ...form });
            emit('updated', user);
        } else {
            const user = await props.createUser({ ...form });
            emit('created', user);
        }
        modalRef.value.close();
    } catch (e) {
        if (e?.response?.status === 422) {
            errors.value = e.response.data.errors ?? {};
        } else {
            errors.value = { email: [e?.response?.data?.message ?? 'An unexpected error occurred.'] };
        }
    } finally {
        saving.value = false;
    }
}
</script>

