<template>
<v-layout class="rounded rounded-md border">

    <!-- App Bar -->

    <app-bar></app-bar>
    <!-- Navigation Drawer -->
    <navgation-bar></navgation-bar>
    <!-- Main Content -->
    <v-main class="d-flex align-center justify-center" height="auto">
        <v-container>
            <v-sheet border="dashed md" color="surface-light" height="auto" rounded="lg" width="100%">
                <slot></slot>
            </v-sheet>
        </v-container>
    </v-main>
</v-layout>
</template>

<script setup>

</script>

<style>
path {
  fill: rgb(38 148 155) !important;
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
