import { ref } from 'vue';

const navItems = ref([
    { label: 'Dashboard', icon: 'bi-house-door-fill', route: '/'          },
    { label: 'Users',     icon: 'bi-people-fill',     route: '/users'     },
    { label: 'Companies', icon: 'bi-buildings-fill',  route: '/companies' },
]);

export function useNavItems() {
    return { navItems };
}
