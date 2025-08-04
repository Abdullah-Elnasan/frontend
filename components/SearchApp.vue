<template>
  <div>
    <v-col cols="12" md="6">
      <v-dialog max-width="650" v-model="dialog">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn icon v-bind="activatorProps" width="120">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card width="100%" title="للبحث عن مقال" dir="rtl" class="ps-1 pb-4 pt-4 pe-1 text-center">
            <div>
              <v-text-field prepend-icon="mdi-magnify" hide-details="auto" v-model="searchQuery"
                @input="debouncedSearch" placeholder="ابحث عن مقال" dir="rtl"></v-text-field>
            </div>

            <div class="pt-4 text-center mt-5">
              <svg-icon v-if="!posts.length && !pending && !error" type="mdi" :path="path2" width="100" height="100" />
              <p v-if="!posts.length && !pending && !error" class="mt-4"
                style="font-size: var(--article-body-font-size);">
                نتائج البحث سوف تظهر هنا
              </p>
              <!-- <p v-if="pending && !posts.length" class="mt-4" style="font-size: var(--article-body-font-size);">
                جارٍ التحميل...
              </p> -->
              <p v-if="error" class="mt-4" style="font-size: var(--article-body-font-size); color: red;">
                خطأ: {{ error.message }}
              </p>
              <v-list v-if="posts.length">
                <v-list-item v-for="p in posts" :key="p.id" class="ps-0 pe-0">
                  <v-card @click="isActive.value = false" :to="`/posts/${p.slug}`" class="hoverable d-flex flex-row justify-space-between align-center">
                    <v-col class="v-col-12 v-col-sm-12 border-start-2 ps-0 pe-0">
                      <v-card-title class="d-flex justify-space-between align-center"
                        style="font-size: 1.3rem; font-weight: bold;">
                        <div>
                          <v-avatar size="50">
                            <v-img alt="John" src="/author.jpg" />
                          </v-avatar>
                          <span class="ps-3 Aljazeera">{{ p.title }}</span>
                        </div>
                        <!-- <v-chip color="secondary">{{ p.category.name }}</v-chip> -->
                      </v-card-title>

                      <v-card-text v-html="snippet(p.content)" class="pa-4 text-justify"
                        style="font-size:var(--article-body-font-size); font-weight: 500;" />

                      <v-card-actions v-if="p.slug" class="d-flex justify-space-between align-center">
                        <div>
                          <v-btn density="default" icon="mdi-open-in-new" style="color: rgb(38 148 155)" />
                          <span class="text-grey">لقراءة كامل المقال</span>
                        </div>
                        <v-card-subtitle class="d-flex justify-end align-center">
                          <svg-icon type="mdi" :path="path" />
                          <span class="pt-1 pe-2">{{ formatDate(p.created_at) }}</span>
                        </v-card-subtitle>
                        <!-- <v-chip color="secondary">{{ p.category.name }}</v-chip> -->
                      </v-card-actions>
                    </v-col>
                  </v-card>
                </v-list-item>
              </v-list>
            </div>
            <v-col cols="12" ref="observerTarget" class="text-center py-4">
              <v-skeleton-loader v-if="pending && posts.length" v-for="n in 3" :key="'skeleton-' + n"
                type="card, article" class="mb-4" />
              <v-progress-circular v-if="pending && !posts.length" indeterminate size="30" color="primary" />
              <v-progress-circular v-else-if="!noMore && posts.length" indeterminate size="30" color="primary"
                dir="rtl"></v-progress-circular>
              <v-alert v-else-if="noMore && posts.length" type="info" dir="rtl">انتهت المقالات.</v-alert>
            </v-col>
            <template v-slot:actions>
              <v-btn class="ml-auto" text="إغلاق" style="font-size: 1.1rem; background-color: #f0f0f0;"
                @click="isActive.value = false"></v-btn>
            </template>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </div>
</template>
<script setup>
import { mdiClipboardTextSearchOutline, mdiCalendar } from '@mdi/js';
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const path2 = mdiClipboardTextSearchOutline;
const path = mdiCalendar;

const searchQuery = ref('');
const posts = ref([]);
const error = ref(null);
const pending = ref(false);
const noMore = ref(false);
const page = ref(1);
const dialog = ref(false);
const scrollPosition = ref(0);
const observerTarget = ref(null);
let observer = null;
let abortController = null;

// دالة البحث باستخدام AbortController
async function searchPost(query, pageNum = 1, signal) {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(
      `${config.public.apiBase}/posts?search=${encodeURIComponent(query)}&page=${pageNum}&limit=15`,
      { signal }
    );
    const data = await response.json();
    return {
      posts: data.posts || [],
      total: data.total || 0,
      error: null
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { posts: [], total: 0, error: null }; // تم الإلغاء
    }
    return {
      posts: [],
      total: 0,
      error: { message: 'فشل البحث. حاول مرة أخرى.' }
    };
  }
}

// البحث المؤجل مع دعم الإلغاء
const debouncedSearch = debounce(async (isNewSearch = true) => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    posts.value = [];
    error.value = null;
    pending.value = false;
    noMore.value = true;
    page.value = 1;
    return;
  }

  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const signal = abortController.signal;

  pending.value = true;
  const result = await searchPost(searchQuery.value, isNewSearch ? 1 : page.value, signal);

  if (isNewSearch) {
    posts.value = result.posts || [];
    page.value = 1;
  } else {
    posts.value = [...posts.value, ...(result.posts || [])];
  }

  error.value = result.error;
  noMore.value = posts.value.length >= (result.total || 0) || result.posts.length === 0;
  pending.value = false;

  if (!isNewSearch && !noMore.value) {
    page.value += 1;
  }
}, 500);

// المراقبة على تغيّر النص
watch(searchQuery, () => {
  debouncedSearch(true);
});

// إلغاء البحث عند إغلاق النافذة
watch(dialog, (val) => {
  if (!val && abortController) {
    abortController.abort();
  }
});

watch(posts, async () => {
  await nextTick();
  setupObserver();
  setTimeout(() => {
    window.scrollTo({ top: scrollPosition.value, behavior: 'instant' });
  }, 500);
});

// إعداد المراقبة للتمرير
function setupObserver() {
  if (observer) {
    observer.disconnect();
  }

  const el = observerTarget.value?.$el || observerTarget.value;
  if (!el || !(el instanceof Element)) return;

  observer = new IntersectionObserver(
    async ([entry]) => {
      if (entry.isIntersecting && !pending.value && !noMore.value && searchQuery.value.trim()) {
        scrollPosition.value = window.scrollY;
        await debouncedSearch(false);
      }
    },
    { rootMargin: '300px', threshold: 0.1 }
  );

  observer.observe(el);
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !pending.value && !noMore.value && posts.value.length > 0) {
        debouncedSearch(false);
      }
    },
    { threshold: 0.1 }
  );

  nextTick(() => {
    setupObserver();
  });

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
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


<style>
.v-text-field input {
  text-align: right !important;
}



.border-start-2 {
  border: 2px solid rgb(38 148 155) !important;
}

.v-input {
  direction: rtl !important;
  padding-left: 10px !important;
  padding-right: 10 !important;
}



@media (max-width: 500px) {
  .v-dialog>.v-overlay__content {
    width: calc(100% - 16px) !important;
  }

  .Aljazeera{
    font-size: 1rem !important;
  }
}
</style>