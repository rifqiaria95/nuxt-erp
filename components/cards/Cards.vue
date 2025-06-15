<template>
    <div :class="columnClass">
        <div class="card h-100">
            <div class="card-body">
                <div v-if="!isAddButtonCard" class="d-flex justify-content-between align-items-center mb-4">
                    <p class="mb-0">{{ total }}</p>
                    <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" title="Avatar" class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/5.png" alt="Avatar" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" title="Avatar" class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/2.png" alt="Avatar" />
                        </li>
                    </ul>
                </div>
                <div v-if="!isAddButtonCard" class="d-flex justify-content-between align-items-center">
                    <div class="pegawai-heading">
                        <h5 class="mb-1">{{ title }}</h5>
                    </div>
                </div>

                <div v-if="isAddButtonCard" class="row h-100">
                     <div class="col-5">
                        <div class="d-flex align-items-end h-100 justify-content-center">
                            <img :src="imageSrc" class="img-fluid" :alt="imageAlt" width="50" />
                        </div>
                    </div>
                    <div class="col-7">
                        <div class="card-body text-sm-end text-center ps-sm-0">
                            <button
                                :data-bs-target="modalTarget"
                                data-bs-toggle="modal"
                                class="btn btn-sm btn-primary mb-4 text-wrap"
                                @click="$emit('button-click')"
                                >
                                {{ buttonText }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        title: String,
        total: [String, Number],
        imageSrc: String,
        imageAlt: String,
        buttonText: String,
        modalTarget: String,
        isAddButtonCard: {
            type: Boolean,
            default: false
        },
        columnClass: {
            type: String,
            default: 'col-xl-4 col-lg-6 col-md-6'
        }
    })
    defineEmits(['button-click']);
</script>