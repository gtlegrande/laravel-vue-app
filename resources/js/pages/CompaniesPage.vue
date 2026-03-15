<template>
    <div>
        <CrudPageHeader title="Companies" add-label="Add Company" @add="modalRef.open()">
            <template #icon>
                <i class="bi bi-building-add me-1"></i>
            </template>
        </CrudPageHeader>

        <IndexTableState
            :error="error"
            :loading="loading"
            :is-empty="!companies.length"
            loading-text="Loading companies..."
            empty-text="No companies found."
        >
            <div class="card shadow-sm">
                <IndexTable>
                    <template #headers>
                        <th scope="col">Name</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        <th scope="col">Email</th>
                        <th scope="col" class="text-end">Actions</th>
                    </template>
                    <template #rows>
                        <IndexTableRow v-for="company in companies" :key="company.id">
                            <IndexTableCell>{{ company.name }}</IndexTableCell>
                            <IndexTableCell>{{ company.city || '-' }}</IndexTableCell>
                            <IndexTableCell>{{ company.state || '-' }}</IndexTableCell>
                            <IndexTableCell>{{ company.email || '-' }}</IndexTableCell>
                            <IndexTableCell class="text-end">
                                <AppButton
                                    variant="secondary"
                                    size="sm"
                                    outline
                                    class="me-1"
                                    @click="modalRef.open(company)"
                                    title="Edit company"
                                >
                                    <i class="bi bi-pencil-fill"></i>
                                </AppButton>
                                <AppButton
                                    variant="danger"
                                    size="sm"
                                    outline
                                    @click="handleDelete(company)"
                                    title="Delete company"
                                >
                                    <i class="bi bi-trash-fill"></i>
                                </AppButton>
                            </IndexTableCell>
                        </IndexTableRow>
                    </template>
                </IndexTable>
            </div>
        </IndexTableState>

        <CompanyFormModal
            ref="modalRef"
            :create-company="createCompany"
            :update-company="updateCompany"
        />

        <ConfirmModal
            ref="confirmRef"
            title="Delete Company"
            confirm-button-text="Delete"
            confirm-variant="danger"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCompanies } from '../composables/useCompanies.js';
import IndexTable       from '../components/table/IndexTable.vue';
import IndexTableRow    from '../components/table/IndexTableRow.vue';
import IndexTableCell   from '../components/table/IndexTableCell.vue';
import CompanyFormModal from '../components/companies/CompanyFormModal.vue';
import ConfirmModal     from '../components/ConfirmModal.vue';
import AppButton        from '../components/AppButton.vue';
import IndexTableState  from '../components/table/IndexTableState.vue';
import CrudPageHeader   from '../components/CrudPageHeader.vue';

const { companies, loading, error, fetchCompanies, createCompany, updateCompany, deleteCompany } = useCompanies();

const modalRef   = ref(null);
const confirmRef = ref(null);

onMounted(fetchCompanies);

async function handleDelete(company) {
    const confirmed = await confirmRef.value.open(
        `Are you sure you want to delete the ${company.name} company? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
        await deleteCompany(company.id);
    } catch (e) {
        error.value = e?.response?.data?.message ?? 'Failed to delete company.';
    }
}
</script>
