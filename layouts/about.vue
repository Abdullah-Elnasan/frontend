<template>
<v-layout class="rounded rounded-md border">

    <!-- App Bar -->

    <app-bar></app-bar>
    <!-- Navigation Drawer -->
    <navgation-bar></navgation-bar>
    <!-- Main Content 2-->
    <v-main class="d-flex align-center justify-center" height="auto">
        <v-container>
            <v-sheet border="dashed md" color="surface-light" height="auto" rounded="lg" width="100%">
                <h1 class="text-center">نبذة عن الكاتب</h1>
            </v-sheet>
            <slot></slot>
        </v-container>
    </v-main>
</v-layout>
</template>

<script setup>

</script>

<style>
path {
  fill: #26949b !important;
}
.v-toolbar__prepend {
    margin-inline: 0 !important;
}

.v-toolbar__content {
    flex-direction: row-reverse !important;
    justify-content: space-between !important;
}

.v-list-item-title,
.v-app-bar-title {
    font-size: var(--article-body-font-size) !important;
    line-height: 1.5 !important;
}

.v-btn--slim:hover {
    background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
