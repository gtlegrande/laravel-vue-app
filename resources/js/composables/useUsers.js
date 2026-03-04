import { ref } from 'vue';
import axios from 'axios';

export function useUsers() {
    const users   = ref([]);
    const loading = ref(false);
    const error   = ref(null);

    async function fetchUsers() {
        loading.value = true;
        error.value   = null;

        try {
            const { data } = await axios.get('/api/users');
            users.value = data.data;
        } catch (e) {
            error.value = e?.response?.data?.message ?? 'Failed to load users.';
        } finally {
            loading.value = false;
        }
    }

    async function createUser(payload) {
        const { data } = await axios.post('/api/users', payload);
        users.value = [...users.value, data.data].sort((a, b) => {
            return a.last_name.localeCompare(b.last_name)
                || a.first_name.localeCompare(b.first_name)
                || a.email.localeCompare(b.email);
        });
        return data.data;
    }

    async function updateUser(id, payload) {
        const { data } = await axios.put(`/api/users/${id}`, payload);
        users.value = users.value.map(u => u.id === id ? data.data : u).sort((a, b) => {
            return a.last_name.localeCompare(b.last_name)
                || a.first_name.localeCompare(b.first_name)
                || a.email.localeCompare(b.email);
        });
        return data.data;
    }

    async function deleteUser(id) {
        await axios.delete(`/api/users/${id}`);
        users.value = users.value.filter(u => u.id !== id);
    }

    return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}
