<template>
    <template v-if="!props.pending && props.posts.length > 0" v-for="p in posts" :key="p.id">
        <v-col cols="12" md="12" dir="rtl">
            <v-card :to="`/posts/${p.slug}`" class="hoverable d-flex flex-row justify-space-between align-center">
                <v-col class="v-col-12 v-col-sm-3">
                    <v-img height="200px" width="100%" class="img-card" :src="p.image" eager />
                </v-col>

                <v-col class="v-col-12 v-col-sm-9 border-start">
                    <v-card-title class="d-flex justify-space-between align-center"
                        style="font-size: 1.3rem; font-weight: bold;">
                        <div>
                            <v-avatar size="50">
                                <v-img alt="John" src="/author.jpg" />
                            </v-avatar>
                            <span class="ps-3 Aljazeera">{{ p.title }}</span>
                        </div>
                        <v-chip color="secondary">{{ p.category.name }}</v-chip>
                    </v-card-title>

                    <v-card-text v-html="snippet(p.content)" class="pa-4 text-justify"
                        style="font-size:var(--article-body-font-size); font-weight: 500;" />

                    <v-card-actions v-if="p.slug" class="d-flex justify-space-between align-center">
                        <div>
                            <v-btn density="default" icon="mdi-open-in-new" style="color: rgb(38 148 155)" />
                            <span class="text-grey">لقراءة كامل المقال</span>
                        </div>
                        <v-card-subtitle class="d-flex justify-end align-center">
                            <span class="pt-1 pe-2">{{ formatDate(p.created_at) }}</span>
                            <svg-icon type="mdi" :path="path" />
                        </v-card-subtitle>
                    </v-card-actions>
                </v-col>
            </v-card>
        </v-col>
    </template>

    <v-col cols="12" ref="observerTarget" class="text-center py-4">
        <v-skeleton-loader v-if="props.pending && props.posts.length" v-for="n in 3" :key="'skeleton-' + n" type="card, article"
            class="mb-4" />
        <v-progress-circular v-if="props.pending && props.posts.length" indeterminate size="30" color="primary" />
        <v-progress-circular v-else-if="!noMore" indeterminate size="30" color="primary"
            dir="rtl"></v-progress-circular>
        <v-alert v-else type="info" dir="rtl">انتهت المقالات.</v-alert>
    </v-col>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    pending: {
        type: Boolean,
        default: false
    },
    error: {
        type: Object,
        default: null
    },
    posts: {
        type: Array,
        default: () => []
    },
    noMore: {
        type: Boolean,
        default: false
    }
});

function snippet(html) {
    const text = html.replace(/<[^>]+>/g, '');
    return text.length > 100 ? text.slice(0, 150) + '........' : text;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
</script>

<style scoped>
path {
    fill: rgb(38 148 155) !important;
}

.Aljazeera {
    font-family: 'Aljazeera', serif !important;
    font-size: var(--article-body-font-size) !important;
}

.img-card .v-img__img--cover {
    object-fit: contain !important;
}

.v-card-text {
    width: auto !important;
}

.text-secondary {
    color: rgb(38 148 155) !important;
}

.border-start {
    border-right: 2px solid rgb(38 148 155) !important;
}

@media (min-width: 960px) {
    .v-container {
        max-width: 1200px !important;
    }
}

@media (max-width: 900px) {
    .v-card-title {
        padding: 0px !important;
        padding-right: 12px !important;
    }

    .v-card-text {
        padding: 12px !important;
    }

    .v-card-actions {
        padding: 6px !important;
    }

    .v-container {
        padding: 6px !important;
    }
}

@media (max-width: 600px) {
    .v-card {
        flex-direction: column !important;
        align-items: center !important;
    }

    .border-start {
        border-right: 0 !important;
        border-top: 2px solid rgb(38 148 155) !important;
    }
}

html,
body {
    scroll-behavior: auto !important;
}
</style>