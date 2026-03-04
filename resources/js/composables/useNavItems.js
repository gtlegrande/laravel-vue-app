import { ref } from 'vue';

const navItems = ref([
    { label: 'Dashboard', icon: 'bi-house-door-fill', route: '/'         },
    { label: 'Users',     icon: 'bi-people-fill',     route: '/users'    },
]);

export function useNavItems() {
    return { navItems };
}
