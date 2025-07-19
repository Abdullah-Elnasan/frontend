<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import { usePosts } from '~/composables/usePosts.js'
import { usePostStore } from '~/stores/postStore'
import { useRouter } from 'vue-router'
import PostFormModal from '~/components/PostFormModal.vue'
import { createPost } from '~/composables/posts/create.js'
import { updatePost } from '~/composables/posts/edit.js'
import { deletePost as apiDeletePost } from '~/composables/posts/delete.js'

const showModal = ref(false)
const editingPost = ref(null)
// Router & Shared State
const router = useRouter()
const selectedPost = useState('selected-post', () => null)

function goToPost(post) {
    selectedPost.value = post
    router.push(`/posts/${post.slug}`)
}



function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
// Store & Composables
const postsStore = usePostStore()
const { posts, error, pending, loadMore, noMore } = usePosts()

// UI States
const observerTarget = ref(null)
const scrollPosition = ref(0)
let observer = null
const debouncedLoadMore = debounce(loadMore, 300)


async function handlePostSubmit(formData, setSuccessMessage) {
    try {
        if (!(formData instanceof FormData)) {
            console.warn('postData يجب أن يكون من نوع FormData')
            return
        }

        const isEdit = formData.has('id')

        const { data, error } = isEdit
            ? await updatePost(formData)  // دالة تحديث API
            : await createPost(formData)  // دالة إنشاء API

        if (error) {
            console.error('فشل في العملية:', error)
            return
        }

        // هنا لا نعدل posts.value, فقط نظهر رسالة نجاح
        setSuccessMessage(isEdit ? 'تم تعديل المقال بنجاح' : 'تم إنشاء المقال بنجاح')

    } catch (err) {
        console.error('خطأ غير متوقع:', err)
    }
}

function addPost() {
    editingPost.value = null
    showModal.value = true
}

function editPost(id) {
    const post = posts.value.find(p => p.id === id)
    if (post) {
        editingPost.value = { ...post }
        showModal.value = true
    }
}
// مراقبة نهاية الصفحة وتحميل المزيد
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

// تحميل أولي
onMounted(async () => {
    if (!posts.value.length && !pending.value && !noMore.value) {
        debouncedLoadMore()
    }

    if (!localStorage.getItem('token')) {
        router.push('/login')
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
    postsStore.setPosts(posts.value)
    setupObserver()
    setTimeout(() => {
        window.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
    }, 500)
})

// دوال مساعدة
function snippet(html) {
    const text = html.replace(/<[^>]+>/g, '')
    return text.length > 100 ? text.slice(0, 50) + '...' : text
}

function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}



async function deletePost(id) {
    if (confirm('هل تريد حذف المقال؟')) {
        const { success, error } = await apiDeletePost(id)
        if (success) {
            posts.value = posts.value.filter(post => post.id !== id)
            alert('تم حذف المنشور بنجاح')
        } else {
            alert('حدث خطأ أثناء الحذف: ' + (error.message || error))
        }
    }
}

</script>

<template>
    <div class="container">
        <h1>قائمة المقالات</h1>

        <div v-if="pending" class="loading">جارِ تحميل البيانات...</div>
        <div v-if="error" class="error">حدث خطأ: {{ error.message || error }}</div>
        <div class="add-container">
            <button class="btn add mb-5" @click="addPost">إضافة مقال جديد</button>
        </div>
        <table v-if="!pending && !error && posts.length > 0">
            <thead>
                <tr>
                    <th>المعرف</th>
                    <th>العنوان</th>
                    <th>مقتطف</th>
                    <th>ألفئة</th>
                    <th>الموقع</th>
                    <th>تاريخ الإنشاء</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in posts" :key="post.id">
                    <td>{{ post.id }}</td>
                    <td>
                        <a href="#" @click.prevent="goToPost(post)" class="post-link">
                            {{ post.title }}
                        </a>
                    </td>
                    <td>{{ snippet(post.content) }}</td>
                    <td>{{ post.category.name }}</td>
                    <td>
                        <span class="location">

                            {{ post.governorate }}
                        </span>
                    </td>
                    <td>
                        {{ formatDate(post.created_at) }}
                    </td>
                    <td class="actions">
                        <button class="btn edit" @click="editPost(post.id)">تعديل</button>
                        <button class="btn delete" @click="deletePost(post.id)">حذف</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="!pending && !error && posts.length === 0" class="empty">لا توجد مقالات لعرضها.</div>

        <div ref="observerTarget" style="height: 1px;"></div>


    </div>

    <PostFormModal :show="showModal" :post="editingPost" @close="showModal = false" @submit="handlePostSubmit" />
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    direction: rtl;
}

h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 700;
}

.loading,
.error,
.empty {
    text-align: center;
    margin: 20px 0;
    font-style: italic;
    color: #666;
}

table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
}

thead tr {
    background-color: #f0f0f0;
}

th,
td {
    padding: 12px 16px;
    text-align: right;
    border-bottom: 1px solid #ddd;
    font-size: 1rem;
}

tbody tr:hover {
    background-color: #fafafa;
    transition: background-color 0.3s ease;
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.btn {
    padding: 6px 14px;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.25s ease, box-shadow 0.25s ease;
    color: white;
    user-select: none;
    min-width: 70px;
}

.btn.edit {
    background-color: #3b82f6;
}

.btn.edit:hover {
    background-color: #2563eb;
    box-shadow: 0 0 8px #2563ebaa;
}

.btn.delete {
    background-color: #ef4444;
}

.btn.delete:hover {
    background-color: #dc2626;
    box-shadow: 0 0 8px #dc2626aa;
}

.btn.add {
    background-color: #10b981;
    min-width: 140px;
    padding: 10px 20px;
    font-size: 1.1rem;
}

.btn.add:hover {
    background-color: #059669;
    box-shadow: 0 0 10px #059669cc;
}

.add-container {
    margin-top: 25px;
    text-align: center;
}

.post-link {
    color: #3b82f6;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
}

.post-link:hover {
    text-decoration: underline;
}

.location {
    display: flex;
    align-items: center;
    gap: 5px;
}
</style>
