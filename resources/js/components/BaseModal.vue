<template>
    <div
        class="modal fade"
        :id="id"
        tabindex="-1"
        :aria-labelledby="`${id}Label`"
        aria-hidden="true"
        ref="modalEl"
    >
        <div :class="['modal-dialog', sizeClass]">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" :id="`${id}Label`">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <slot />
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        <AppButton variant="secondary" data-bs-dismiss="modal">Close</AppButton>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import AppButton from './AppButton.vue';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        default: null,
        validator: (v) => ['sm', 'lg', 'xl'].includes(v),
    },
});

const emit = defineEmits(['show', 'shown', 'hide', 'hidden']);

const modalEl = ref(null);

const sizeClass = computed(() => props.size ? `modal-${props.size}` : null);

onMounted(() => {
    modalEl.value.addEventListener('show.bs.modal',   () => emit('show'));
    modalEl.value.addEventListener('shown.bs.modal',  () => emit('shown'));
    modalEl.value.addEventListener('hide.bs.modal',   () => emit('hide'));
    modalEl.value.addEventListener('hidden.bs.modal', () => emit('hidden'));
});

onBeforeUnmount(() => {
    Modal.getInstance(modalEl.value)?.dispose();
});

function open() {
    Modal.getOrCreateInstance(modalEl.value).show();
}

function close() {
    Modal.getInstance(modalEl.value)?.hide();
}

defineExpose({ open, close });
</script>

