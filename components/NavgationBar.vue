<template>
  <v-navigation-drawer v-model="dropdownStore.isOpen" location="right" dir="rtl"
    style="font-size: var(--article-body-font-size) !important;">
    <v-list nav>
      <template v-for="link in links" :key="link.title">
        <v-list-group v-if="link.children" :value="false">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item v-for="child in link.children" :key="child.title" :to="child.to" link>
            <v-list-item-title>{{ child.title }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :to="link.to" link>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    <!-- Footer في الأسفل -->


    <v-list class="mt-auto" style="display: flex;
    align-items: flex-end;
    height: calc(-269px + 100vh);">
      <v-list-item href="https://abdullah-elnasan.github.io/nadiShabay/" target="_blank" link>
        <v-list-item-title><img src="/logo.7b57de2f.png" width="25" height="25" alt=""></v-list-item-title>
      </v-list-item>
      <v-list-item href="https://www.facebook.com/share/16rru69CqC/?mibextid=wwXIfr" target="_blank" link>
        <v-list-item-title><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30"
            viewBox="0 0 30 30">
            <path
              d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h10v-9h-3v-3h3v-1.611C16,9.339,17.486,8,20.021,8 c1.214,0,1.856,0.09,2.16,0.131V11h-1.729C19.376,11,19,11.568,19,12.718V14h3.154l-0.428,3H19v9h5c1.105,0,2-0.895,2-2V6 C26,4.895,25.104,4,24,4z">
            </path>
          </svg></v-list-item-title>
      </v-list-item>
      <v-list-item href="https://t.me/alaa_al_betar" target="_blank" link>
        <v-list-item-title><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30"
            viewBox="0 0 32 32">
            <path
              d="M16,4C9.37,4,4,9.37,4,16s5.37,12,12,12s12-5.37,12-12S22.63,4,16,4z M18.852,21.859c-1.162-0.217-2.638-1.108-3.622-2.468 c-0.296-0.409-0.23-0.979,0.14-1.321l2.062-1.901c0.406-0.374,0.432-1.007,0.058-1.413s-1.006-0.431-1.413-0.058l-3.16,2.913 c-0.171,0.157-0.396,0.256-0.628,0.267c-1.166,0.058-2.118-0.074-2.876-0.508c-0.545-0.312-0.676-1.063-0.254-1.528 c2.31-2.547,7.461-5.014,11.856-4.891c0.474,0.013,0.875,0.384,0.929,0.855c0.306,2.664-0.675,7.774-2.135,9.69 C19.587,21.788,19.215,21.927,18.852,21.859z">
            </path>
          </svg></v-list-item-title>
      </v-list-item>
      <v-list-item href="https://x.com/alaa_albitar80?s=11" target="_blank" link>
        <v-list-item-title><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30"
            viewBox="0 0 30 30">
            <path
              d="M 6 4 C 4.895 4 4 4.895 4 6 L 4 24 C 4 25.105 4.895 26 6 26 L 24 26 C 25.105 26 26 25.105 26 24 L 26 6 C 26 4.895 25.105 4 24 4 L 6 4 z M 8.6484375 9 L 13.259766 9 L 15.951172 12.847656 L 19.28125 9 L 20.732422 9 L 16.603516 13.78125 L 21.654297 21 L 17.042969 21 L 14.056641 16.730469 L 10.369141 21 L 8.8945312 21 L 13.400391 15.794922 L 8.6484375 9 z M 10.878906 10.183594 L 17.632812 19.810547 L 19.421875 19.810547 L 12.666016 10.183594 L 10.878906 10.183594 z">
            </path>
          </svg></v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <div style="font-size: 16px; padding: 4px; text-align: center;">
      <p style="color: #26949b;">
        <a href="https://github.com/Abdullah-Elnasan"  style="color: black; text-decoration: none;" >عبد الله النعسان  </a> © 2025 
      </p>
    </div>
  </v-navigation-drawer>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategories } from '~/composables/useCategories'
import { useDropdownStore } from '~/stores/dropdownStore'
import slugify from 'slugify'

const dropdownStore = useDropdownStore()
const { categories, loadCategories } = useCategories()

const categoriesApi = ref([])

const links = ref([
  {
    title: 'الرئيسية',
    to: '/'
  },
  {
    title: 'المقالات',
    children: [] // سيتم تحميلها لاحقًا
  },
  {
    title: 'نبذة عن الكاتب',
    to: '/about'
  }
])

onMounted(async () => {
  if (categories.value.length === 0) {
    await loadCategories()
  }

  categoriesApi.value = categories.value

  links.value[1].children = categories.value.map((cat) => ({
    title: cat.name,
    to: `/categories/${cat.id}/${cat.name}`
  }))
})
</script>

<style scoped>
.v-list-item {
  padding: 4px 12px !important;
}

.v-list-item-title {
  color: #26949b !important
}


</style>