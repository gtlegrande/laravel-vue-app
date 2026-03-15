import { ref } from 'vue';
import axios from 'axios';

export function useCompanies() {
    const companies = ref([]);
    const loading   = ref(false);
    const error     = ref(null);

    async function fetchCompanies() {
        loading.value = true;
        error.value   = null;

        try {
            const { data } = await axios.get('/api/companies');
            companies.value = data.data;
        } catch (e) {
            error.value = e?.response?.data?.message ?? 'Failed to load companies.';
        } finally {
            loading.value = false;
        }
    }

    async function createCompany(payload) {
        const { data } = await axios.post('/api/companies', payload);
        companies.value = [...companies.value, data.data].sort((a, b) => {
            return a.name.localeCompare(b.name)
                || (a.email ?? '').localeCompare(b.email ?? '');
        });
        return data.data;
    }

    async function updateCompany(id, payload) {
        const { data } = await axios.put(`/api/companies/${id}`, payload);
        companies.value = companies.value.map(c => c.id === id ? data.data : c).sort((a, b) => {
            return a.name.localeCompare(b.name)
                || (a.email ?? '').localeCompare(b.email ?? '');
        });
        return data.data;
    }

    async function deleteCompany(id) {
        await axios.delete(`/api/companies/${id}`);
        companies.value = companies.value.filter(c => c.id !== id);
    }

    return { companies, loading, error, fetchCompanies, createCompany, updateCompany, deleteCompany };
}

