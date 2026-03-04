<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Users</h2>
            <AppButton variant="primary" @click="modalRef.open()">
                <i class="bi bi-person-plus-fill me-1"></i> Add User
            </AppButton>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <!-- Loading -->
        <div v-else-if="loading" class="text-center py-5 text-muted">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading users...
        </div>

        <!-- Empty -->
        <div v-else-if="!users.length" class="card shadow-sm">
            <div class="card-body text-muted">No users found.</div>
        </div>

        <!-- Table -->
        <div v-else class="card shadow-sm">
            <IndexTable>
                <template #headers>
                    <th scope="col">Last Name</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Email</th>
                    <th scope="col" class="text-end">Actions</th>
                </template>
                <template #rows>
                    <IndexTableRow v-for="user in users" :key="user.id">
                        <IndexTableCell>{{ user.last_name }}</IndexTableCell>
                        <IndexTableCell>{{ user.first_name }}</IndexTableCell>
                        <IndexTableCell>{{ user.email }}</IndexTableCell>
                        <IndexTableCell class="text-end">
                            <AppButton
                                variant="secondary"
                                size="sm"
                                outline
                                class="me-1"
                                @click="modalRef.open(user)"
                                title="Edit user"
                            >
                                <i class="bi bi-pencil-fill"></i>
                            </AppButton>
                            <AppButton
                                variant="danger"
                                size="sm"
                                outline
                                @click="handleDelete(user)"
                                title="Delete user"
                            >
                                <i class="bi bi-trash-fill"></i>
                            </AppButton>
                        </IndexTableCell>
                    </IndexTableRow>
                </template>
            </IndexTable>
        </div>

        <UserFormModal
            ref="modalRef"
            :create-user="createUser"
            :update-user="updateUser"
        />

        <ConfirmModal
            ref="confirmRef"
            title="Delete User"
            confirm-button-text="Delete"
            confirm-variant="danger"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsers } from '../composables/useUsers.js';
import IndexTable     from '../components/table/IndexTable.vue';
import IndexTableRow  from '../components/table/IndexTableRow.vue';
import IndexTableCell from '../components/table/IndexTableCell.vue';
import UserFormModal  from '../components/users/UserFormModal.vue';
import ConfirmModal   from '../components/ConfirmModal.vue';
import AppButton      from '../components/AppButton.vue';

const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();

const modalRef   = ref(null);
const confirmRef = ref(null);

onMounted(fetchUsers);

async function handleDelete(user) {
    const confirmed = await confirmRef.value.open(
        `Are you sure you want to delete the ${user.first_name} ${user.last_name} user? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
        await deleteUser(user.id);
    } catch (e) {
        error.value = e?.response?.data?.message ?? 'Failed to delete user.';
    }
}
</script>
