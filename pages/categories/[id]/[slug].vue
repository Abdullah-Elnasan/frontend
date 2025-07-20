<template>
  <v-container>
    <v-row mt-0>
      <v-col cols="12" dir="rtl" class="text-center mb-4">
        <h1>{{ slug }}</h1>
      </v-col>

      <template v-if="!pending && posts.length > 0" v-for="p in posts" :key="p.id">
        <v-col cols="12" md="12" dir="rtl">
          <v-card  @click="goToPost(p)"class="hoverable d-flex flex-row justify-space-between align-center">
            <v-col class="v-col-12 v-col-sm-3">
              <v-img height="200px" width="100%" class="img-card" :src="p.image" eager />
              <span class="title-600 ps-3 Aljazeera">{{ p.title }}</span>
            </v-col>

            <v-col class="v-col-12 v-col-sm-9 border-start">
              <v-card-title class="d-flex justify-space-between align-center"
                style="font-size: 1.3rem; font-weight: bold;">
                <div>
                  <v-avatar size="50">
                    <v-img alt="John" src="/author.jpg" />
                  </v-avatar>
                  <span class="title-601 ps-3 Aljazeera">{{ p.title }}</span>
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
                  <svg-icon type="mdi" :path="path2" />
                  <span class="pt-1 pe-2">{{ p.governorate + " -" + " مدينة" + p.city }}</span>
                </v-card-subtitle>
                <v-card-subtitle class="d-flex justify-end align-center">
                  <svg-icon type="mdi" :path="path" />
                  <span class="pt-1 pe-2 ps-1">{{ formatDate(p.created_at) }}</span>
                </v-card-subtitle>
              </v-card-actions>
            </v-col>
          </v-card>
        </v-col>
      </template>

      <v-alert v-if="error" type="error" class="ma-5">
        حدث خطأ أثناء جلب المنشورات.
      </v-alert>

      <v-alert v-else-if="!posts.length && !pending" type="info" class="ma-5" dir="rtl">
        لا توجد منشورات حالياً.
      </v-alert>

      <v-col cols="12" ref="observerTarget" class="text-center py-4 ">
        <v-skeleton-loader v-if="pending && posts.length" v-for="n in 3" :key="'skeleton-' + n" type="card, article"
          class="mb-4" />
        <v-progress-circular v-if="pending && posts.length" indeterminate size="30" color="primary" />
        <v-progress-circular v-else-if="!noMore" indeterminate size="30" color="primary" dir="rtl"></v-progress-circular>
        <v-alert v-else type="info" dir="rtl" class="text-start">انتهت المقالات.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import { usePostsCategory } from '~/composables/usePostsCategory.js'
import { mdiCalendar, mdiMapMarkerOutline } from '@mdi/js'
import { useRoute } from 'vue-router'


function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const route = useRoute()
const id = computed(() => route.params.id)
const slug = computed(() => route.params.slug)
const router = useRouter()
const selectedPost = useState('selected-post', () => null)

function goToPost(post) {
  selectedPost.value = post
  router.push(`/posts/${post.slug}`)
}

const path = mdiCalendar
const path2 = mdiMapMarkerOutline
const { posts, error, pending, loadMore, noMore } = usePostsCategory(id)
const observerTarget = ref(null)
const scrollPosition = ref(0)
let observer = null

const debouncedLoadMore = debounce(loadMore, 300)

function setupObserver() {
  const el = observerTarget.value?.$el || observerTarget.value
  if (!el || !(el instanceof Element)) return

  if (!observer) {
    observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && !pending.value && !noMore.value) {
        scrollPosition.value = window.scrollY
        await debouncedLoadMore()
        await nextTick()
        setTimeout(() => {
          window.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
        }, 500)
      }
    }, { rootMargin: '300px', threshold: 0.1 })
  }

  observer.observe(el)
}

onMounted(() => {
  if (!posts.value.length && !pending.value && !noMore.value) {
    debouncedLoadMore()
  }

  const savedScrollY = sessionStorage.getItem('scrollY')
  if (savedScrollY) {
    window.scrollTo({ top: parseInt(savedScrollY), behavior: 'instant' })
  }

  nextTick(() => {
    setupObserver()
  })
})

onBeforeUnmount(() => {
  sessionStorage.setItem('scrollY', window.scrollY.toString())
  if (observer) {
    const el = observerTarget.value?.$el || observerTarget.value
    if (el && el instanceof Element) {
      observer.unobserve(el)
    }
  }
})

watch(posts, async () => {
  await nextTick()
  setupObserver(); // Re-setup observer after posts update
  setTimeout(() => {
    window.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
  }, 500)
})

function snippet(html) {
  const text = html.replace(/<[^>]+>/g, '')
  return text.length > 100 ? text.slice(0, 150) + '........' : text
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>


<style scoped lang="scss">
path {
  fill: rgb(38 148 155) !important;
}

.Aljazeera {
  font-family: 'Aljazeera', serif !important;
  font-size: var(--article-body-font-size) !important;
}
.title-601 {
  display: inline;
}

.title-600 {
  display: none;
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
    padding-right: 12px !important;
    padding-left: 12px !important;
    padding-bottom: 12px !important;
    padding-top: 16px !important;
  }

  .v-card-actions {
    padding: 6px !important;
  }

  .v-container {
    padding: 6px !important;
  }
}
@media (max-width: 600px) {
  .v-main {
    .v-container {
      padding: 0px !important;
    }
  }

  .v-card-title {
    padding-right: 0px !important;
  }

  .v-container {
    padding: 0px !important;
  }

  .v-card {
    flex-direction: column !important;
    align-items: center !important;
  }

  .border-start {
    border-right: 0 !important;
    border-top: 2px solid rgb(38 148 155) !important;
  }

  .v-card-actions {
    gap: 0 !important;
    padding: 0 !important;

  }

  .v-card-actions>div {
    font-size: 0.8rem !important;

  }

  .v-card-actions>div>button {
    width: 24px !important;
    height: 24px !important;
  }

  .v-card-subtitle {
    padding: 0 !important;
  }


}

@media (max-width: 500px) {
    .title-601 {
    display: none;
  }

  .title-600 {
    display: block;
  }

  .title-600-center {
    text-align: center;
  }

  .img-card{
    margin-bottom: 10px !important;
  }

    .v-card-actions>div {
    font-size: 0.6rem !important;
  }
}
html,
body {
  scroll-behavior: auto !important;
}
</style>
