<template>
    <button
        :type="type"
        :class="classes"
        :disabled="disabled || loading"
        v-bind="$attrs"
    >
        <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    type: {
        type: String,
        default: 'button',
    },
    variant: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: null,
        validator: (v) => ['sm', 'lg'].includes(v),
    },
    outline: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const classes = computed(() => [
    'btn',
    props.outline ? `btn-outline-${props.variant}` : `btn-${props.variant}`,
    props.size ? `btn-${props.size}` : null,
]);
</script>

