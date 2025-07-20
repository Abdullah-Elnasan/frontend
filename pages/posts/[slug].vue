<template>
  <v-container class="mt-5" v-if="postSlug">
    <v-card dir="rtl">
      <v-col class="v-col-12 ">
        <v-img height="300px" width="100%" class="img-card" :src="postSlug.image" eager />
      </v-col>
      <v-divider></v-divider>
      <v-card-title class="d-flex justify-space-between align-center" style="font-size: 1.3rem; font-weight: bold; margin-top: 20px;">
        <div>
          <v-avatar size="50">
            <v-img alt="John" src="/author.jpg" />
          </v-avatar>
          <span class="ps-3 Aljazeera">{{ postSlug.title }}</span>
        </div>
      </v-card-title>
      <!-- <v-card-subtitle>{{ formatDate(postSlug.created_at) }}</v-card-subtitle> -->
      <v-card-text v-html="postSlug.content" class="pa-5 ps-5 ms-2 text-justify"
        style="font-size:var(--article-body-font-size); font-weight: 500;  white-space: pre-wrap;" />

        <v-card-actions v-if="postSlug.slug" class="d-flex justify-space-start align-center">
                <v-card-subtitle class="d-flex justify-end align-center ps-1">
                  <svg-icon type="mdi" :path="path2" />
                  <span class="pt-1">{{ postSlug.governorate + " -"  + postSlug.city }}</span>
                </v-card-subtitle>
                <v-card-subtitle class="d-flex justify-end align-center ps-1">
                  <svg-icon type="mdi" :path="path" />
                  <span class="pt-1">{{  formatDate(postSlug.created_at)  }}</span>
                </v-card-subtitle>
                <v-card-subtitle class="d-flex justify-end align-center ps-1">
                          <v-chip color="secondary">{{ postSlug.category.name }}</v-chip>
                </v-card-subtitle>
              </v-card-actions>
    </v-card>
  </v-container>

  <v-progress-circular v-else-if="pending" indeterminate size="40" color="primary" />
  <v-alert v-else type="error">تعذّر العثور على المنشور</v-alert>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { usePost } from '~/composables/usePost'  // تأكد من المسار
const route = useRoute()
const slug = route.params.slug
import { mdiCalendar , mdiMapMarkerOutline } from '@mdi/js'
const path = mdiCalendar
const path2 = mdiMapMarkerOutline
const pending = ref(true)
const postSlug = ref(null)

const selectedPost = useState('selected-post')

onMounted(async () => {
  try {
    if (selectedPost.value && selectedPost.value.slug === slug) {
      postSlug.value = selectedPost.value
    } else {
      const { post, error } = await usePost(slug)

      if (error.value) {
        return
      }
      postSlug.value = post.value

    }
  } catch (err) {
  } finally {
    pending.value = false
  }
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
  /* .v-card-title {
    padding: 0px !important;
    padding-right: 12px !important;
  } */

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