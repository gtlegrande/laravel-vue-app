<template>
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
                <tr>
                    <slot name="headers" />
                </tr>
            </thead>
            <tbody>
                <slot name="rows" />
            </tbody>
        </table>
    </div>
</template>

