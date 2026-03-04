<template>
    <BaseModal id="confirmModal" :title="title" size="sm" ref="modalRef" @hidden="onHidden">
        <p class="mb-0">{{ message }}</p>

        <template #footer>
            <AppButton variant="secondary" @click="cancel">Cancel</AppButton>
            <AppButton :variant="confirmButtonVariant" :loading="confirming" @click="confirm">
                {{ confirmButtonText }}
            </AppButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseModal from './BaseModal.vue';
import AppButton from './AppButton.vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Confirm',
    },
    confirmButtonText: {
        type: String,
        default: 'Confirm',
    },
    confirmVariant: {
        type: String,
        default: 'danger',
    },
});

// ...existing code...

const confirmButtonVariant = computed(() => props.confirmVariant);

const emit = defineEmits(['confirmed', 'cancelled']);

const modalRef   = ref(null);
const confirming = ref(false);
const message    = ref('');
let   resolveCallback = null;

function open(msg) {
    message.value = msg;
    confirming.value = false;
    modalRef.value.open();

    return new Promise((resolve) => {
        resolveCallback = resolve;
    });
}

async function confirm() {
    confirming.value = true;
    try {
        if (resolveCallback) resolveCallback(true);
        emit('confirmed');
        modalRef.value.close();
    } finally {
        confirming.value = false;
    }
}

function cancel() {
    if (resolveCallback) resolveCallback(false);
    emit('cancelled');
    modalRef.value.close();
}

function onHidden() {
    // Resolve as false if closed without confirming (e.g. clicking backdrop)
    if (resolveCallback) {
        resolveCallback(false);
        resolveCallback = null;
    }
}

defineExpose({ open });
</script>

