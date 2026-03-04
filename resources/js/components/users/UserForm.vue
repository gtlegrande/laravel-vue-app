<template>
    <form @submit.prevent="$emit('submit')" novalidate>
        <FormInput
            id="firstName"
            label="First Name"
            v-model="form.first_name"
            placeholder="Enter first name"
            :error="fieldError('first_name')"
            required
        />

        <FormInput
            id="lastName"
            label="Last Name"
            v-model="form.last_name"
            placeholder="Enter last name"
            :error="fieldError('last_name')"
            required
        />

        <FormInput
            id="email"
            label="Email"
            type="email"
            v-model="form.email"
            placeholder="Enter email address"
            :error="fieldError('email')"
            required
        />

        <FormInput
            id="password"
            label="Password"
            type="password"
            v-model="form.password"
            placeholder="Enter password"
            :error="fieldError('password')"
            :required="!isEditing"
            :hint="isEditing ? '(leave blank to keep current)' : null"
            autocomplete="new-password"
        />

        <FormInput
            id="passwordConfirmation"
            label="Confirm Password"
            type="password"
            v-model="form.password_confirmation"
            placeholder="Confirm password"
            :error="fieldError('password_confirmation')"
            :required="!isEditing"
            autocomplete="new-password"
        />
    </form>
</template>

<script setup>
import FormInput from '../FormInput.vue';

const props = defineProps({
    form: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        default: () => ({}),
    },
    isEditing: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['submit']);

function fieldError(field) {
    return props.errors[field]?.[0] ?? null;
}
</script>
