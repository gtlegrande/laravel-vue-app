<template>
    <div class="mb-3">
        <label :for="id" class="form-label">
            {{ label }}
            <span v-if="required && !hint" class="text-danger">*</span>
            <span v-if="hint" class="text-muted small">{{ hint }}</span>
        </label>
        <input
            :id="id"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :class="['form-control', error ? 'is-invalid' : '']"
            v-bind="$attrs"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <div v-if="error" class="invalid-feedback">{{ error }}</div>
    </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    hint: {
        type: String,
        default: null,
    },
    error: {
        type: String,
        default: null,
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
});

defineEmits(['update:modelValue']);
</script>

