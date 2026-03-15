<template>
    <BaseModal :id="modalId" :title="isEditing ? 'Edit Company' : 'Add Company'" ref="modalRef" @hidden="resetForm">
        <CompanyForm :form="form" :errors="errors" @submit="submit" />

        <template #footer>
            <AppButton variant="secondary" @click="modalRef.close()">Cancel</AppButton>
            <AppButton variant="primary" :loading="saving" @click="submit">
                {{ isEditing ? 'Save Changes' : 'Create Company' }}
            </AppButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import BaseModal   from '../BaseModal.vue';
import CompanyForm from './CompanyForm.vue';
import AppButton   from '../AppButton.vue';

const props = defineProps({
    createCompany: { type: Function, required: true },
    updateCompany: { type: Function, required: true },
});

const emit = defineEmits(['created', 'updated']);

const modalRef       = ref(null);
const saving         = ref(false);
const errors         = ref({});
const editingCompany = ref(null);

const isEditing = computed(() => editingCompany.value !== null);
const modalId   = 'companyFormModal';

const form = reactive({
    name:    '',
    address: '',
    city:    '',
    state:   '',
    zip:     '',
    country: '',
    website: '',
    phone:   '',
    email:   '',
});

function validate() {
    const e = {};

    if (!form.name.trim()) e.name = ['Company name is required.'];

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = ['Please enter a valid email address.'];
    }

    if (form.website) {
        try {
            // Ensure users provide a fully-qualified URL that matches backend url validation.
            new URL(form.website);
        } catch {
            e.website = ['Please enter a valid website URL.'];
        }
    }

    return e;
}

function resetForm() {
    editingCompany.value = null;
    form.name            = '';
    form.address         = '';
    form.city            = '';
    form.state           = '';
    form.zip             = '';
    form.country         = '';
    form.website         = '';
    form.phone           = '';
    form.email           = '';
    errors.value         = {};
}

function open(company = null) {
    editingCompany.value = company;

    if (company) {
        form.name    = company.name ?? '';
        form.address = company.address ?? '';
        form.city    = company.city ?? '';
        form.state   = company.state ?? '';
        form.zip     = company.zip ?? '';
        form.country = company.country ?? '';
        form.website = company.website ?? '';
        form.phone   = company.phone ?? '';
        form.email   = company.email ?? '';
    }

    errors.value = {};
    modalRef.value.open();
}

defineExpose({ open });

async function submit() {
    errors.value = validate();
    if (Object.keys(errors.value).length) return;

    saving.value = true;
    try {
        if (isEditing.value) {
            const company = await props.updateCompany(editingCompany.value.id, { ...form });
            emit('updated', company);
        } else {
            const company = await props.createCompany({ ...form });
            emit('created', company);
        }
        modalRef.value.close();
    } catch (e) {
        if (e?.response?.status === 422) {
            errors.value = e.response.data.errors ?? {};
        } else {
            errors.value = { name: [e?.response?.data?.message ?? 'An unexpected error occurred.'] };
        }
    } finally {
        saving.value = false;
    }
}
</script>

