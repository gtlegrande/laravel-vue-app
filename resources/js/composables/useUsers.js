import { ref } from 'vue';
import axios from 'axios';

export function useUsers() {
    const users      = ref([]);
    const loading   = ref(false);
    const error     = ref(null);
    const pagination = ref({
        current_page: 1,
        last_page:    1,
        per_page:     15,
        total:        0,
        from:         null,
        to:           null,
    });

    async function fetchUsers(page = 1) {
        loading.value = true;
        error.value   = null;

        try {
            const { data } = await axios.get('/api/users', { params: { page } });
            users.value = data.data;
            if (data.meta) {
                pagination.value = {
                    current_page: data.meta.current_page,
                    last_page:    data.meta.last_page,
                    per_page:     data.meta.per_page,
                    total:        data.meta.total,
                    from:         data.meta.from,
                    to:           data.meta.to,
                };
            }
        } catch (e) {
            error.value = e?.response?.data?.message ?? 'Failed to load users.';
        } finally {
            loading.value = false;
        }
    }

    async function createUser(payload) {
        const { data } = await axios.post('/api/users', payload);
        await fetchUsers(pagination.value.current_page);
        return data.data;
    }

    async function updateUser(id, payload) {
        const { data } = await axios.put(`/api/users/${id}`, payload);
        users.value = users.value.map(u => u.id === id ? data.data : u);
        return data.data;
    }

    async function deleteUser(id) {
        await axios.delete(`/api/users/${id}`);
        const { current_page, last_page } = pagination.value;
        const remaining = users.value.filter(u => u.id !== id).length;
        const page = remaining === 0 && current_page > 1 ? current_page - 1 : current_page;
        await fetchUsers(Math.min(page, last_page));
    }

    return { users, loading, error, pagination, fetchUsers, createUser, updateUser, deleteUser };
}
