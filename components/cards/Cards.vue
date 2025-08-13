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

                <div v-if="isAddButtonCard" class="add-button-card">
                    <!-- Desktop Layout -->
                    <div class="row h-100 d-none d-md-flex">
                         <div class="col-5">
                            <div class="d-flex align-items-end h-100 justify-content-center">
                                <img :src="imageSrc" class="img-fluid" :alt="imageAlt" width="50" />
                            </div>
                        </div>
                        <div class="col-7">
                            <div class="card-body text-sm-end text-center ps-sm-0">
                                <button
                                    class="btn btn-sm btn-primary mb-4 text-wrap button-add"
                                    @click="$emit('button-click')"
                                    >
                                    {{ buttonText }}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mobile Layout -->
                    <div class="mobile-layout d-md-none">
                        <div class="text-center mb-3">
                            <img :src="imageSrc" class="img-fluid mobile-image" :alt="imageAlt" width="60" />
                        </div>
                        <div class="text-center">
                            <button
                                class="btn btn-primary text-wrap button-add-mobile"
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

<style scoped>
    .button-add {
        width: 100%;
    }
    
    /* Mobile Layout Styles */
    .mobile-layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 1rem;
    }
    
    .mobile-image {
        max-width: 80px;
        height: auto;
        margin-bottom: 1rem;
    }
    
    .button-add-mobile {
        width: 100%;
        max-width: 200px;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        border-radius: 8px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 575.98px) {
        .mobile-layout {
            padding: 0.75rem;
        }
        
        .mobile-image {
            max-width: 60px;
            margin-bottom: 0.75rem;
        }
        
        .button-add-mobile {
            max-width: 180px;
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
        }
    }
    
    /* Ensure proper spacing on very small screens */
    @media (max-width: 375px) {
        .mobile-layout {
            padding: 0.5rem;
        }
        
        .mobile-image {
            max-width: 50px;
            margin-bottom: 0.5rem;
        }
        
        .button-add-mobile {
            max-width: 160px;
            padding: 0.5rem 0.7rem;
            font-size: 0.8rem;
        }
    }
</style>