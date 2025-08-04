<template>
    <v-app-bar color="teal-darken-4" image="/header4.jpg">
        <template v-slot:image>
            <v-img gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"></v-img>
        </template>

        <template v-slot:prepend>
            <v-app-bar-title>مدونة علاء البيطار</v-app-bar-title>
            <v-app-bar-nav-icon @click="dropdownStore.toggle"></v-app-bar-nav-icon>
        </template>

        <div style="width: 100px !important;">
            <search-app ></search-app>
        </div>
    </v-app-bar>
</template>

<script setup>
const dropdownStore = useDropdownStore()


</script>


<style scoped>
.v-btn--icon.v-btn--density-default {
  width: 50px !important;
}

</style>