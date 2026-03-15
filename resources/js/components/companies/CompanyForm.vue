<template>
    <form @submit.prevent="$emit('submit')" novalidate>
        <FormInput
            id="companyName"
            label="Name"
            v-model="form.name"
            placeholder="Enter company name"
            :error="fieldError('name')"
            required
        />

        <FormInput
            id="companyAddress"
            label="Address"
            v-model="form.address"
            placeholder="Enter address"
            :error="fieldError('address')"
        />

        <FormInput
            id="companyCity"
            label="City"
            v-model="form.city"
            placeholder="Enter city"
            :error="fieldError('city')"
        />

        <FormInput
            id="companyState"
            label="State"
            v-model="form.state"
            placeholder="Enter state"
            :error="fieldError('state')"
        />

        <FormInput
            id="companyZip"
            label="Zip"
            v-model="form.zip"
            placeholder="Enter zip"
            :error="fieldError('zip')"
        />

        <FormInput
            id="companyCountry"
            label="Country"
            v-model="form.country"
            placeholder="Enter country"
            :error="fieldError('country')"
        />

        <FormInput
            id="companyWebsite"
            label="Website"
            type="url"
            v-model="form.website"
            placeholder="https://example.com"
            :error="fieldError('website')"
        />

        <FormInput
            id="companyPhone"
            label="Phone"
            v-model="form.phone"
            placeholder="Enter phone"
            :error="fieldError('phone')"
        />

        <FormInput
            id="companyEmail"
            label="Email"
            type="email"
            v-model="form.email"
            placeholder="Enter company email"
            :error="fieldError('email')"
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
});

defineEmits(['submit']);

function fieldError(field) {
    return props.errors[field]?.[0] ?? null;
}
</script>

