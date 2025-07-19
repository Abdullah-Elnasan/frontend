<template>
    <div class="container">
        <h1>قائمة الفئات</h1>

        <div v-if="pending" class="loading">جارِ تحميل البيانات...</div>
        <div v-if="error" class="error">حدث خطأ: {{ error.message || error }}</div>
        <div class="add-container">
            <button class="btn add mb-5" @click="addCate">إضافة فئة جديد</button>
        </div>
        <table v-if="!pending && !error && categories.length > 0">
            <thead>
                <tr>
                    <th>المعرف</th>
                    <th>ألفئة</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cate in categories" :key="cate.id">
                    <td>{{ cate.id }}</td>
                    <td>{{ cate.name }}</td>
                    <td class="actions">
                        <button class="btn edit" @click="editCate(cate.id)">تعديل</button>
                        <button class="btn delete" @click="deleteCate(cate.id)">حذف</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="!pending && !error && categories.length === 0" class="empty">لا توجد فئات لعرضها.</div>

        <div ref="observerTarget" style="height: 1px;"></div>


    </div>

    <PostCategoryForm :show="showModal" :cate="editingCate" @close="showModal = false" @submit="handlePostSubmit" />
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { createCategory } from '~/composables/categories/create'
import { deleteCategory } from '~/composables/categories/delete'
import { updateCate } from '~/composables/categories/edit'

import { useCategories } from '~/composables/useCategories'

const showModal = ref(false)
const editingCate = ref(null)
// Router & Shared State
const router = useRouter()
const selectedPost = useState('selected-post', () => null)

function addCate() {
    editingCate.value = null
    showModal.value = true
}
function editCate(id) {
    console.log(id)
    const cate1 = categories.value.find(p => p.id === id)
    if (cate1) {
        editingCate.value = { ...cate1 }
        showModal.value = true
    }
}

async function deleteCate(id) {
    if (confirm('هل تريد حذف الفئة؟')) {
        const { success, error } = await deleteCategory(id)
        if (success) {
            categories.value = categories.value.filter(cate => cate.id !== id)
            alert('تم حذف الفئة بنجاح')
        } else {
            alert('حدث خطأ أثناء الحذف: ' + (error.message || error))
        }
    }
}

async function handlePostSubmit(formData, setSuccessMessage) {
    try {

        const isEdit = formData.id 
        console.log(isEdit)

        const { data, error } = isEdit
            ? await updateCate(formData)  // دالة تحديث API
            : await createCategory(formData)  // دالة إنشاء API

        if (error) {
            console.error('فشل في العملية:', error)
            return
        }

        // هنا لا نعدل posts.value, فقط نظهر رسالة نجاح
        setSuccessMessage(isEdit ? 'تم تعديل الفئة بنجاح' : 'تم إنشاء الفئة بنجاح')

    } catch (err) {
        console.error('خطأ غير متوقع:', err)
    }
}

const { error, pending, categories, loadCategories } = useCategories()

const categoriesApi = []
onMounted(async () => {
    if (categories.value.length === 0) {
        await loadCategories()
    }

    categoriesApi.value = categories.value
    if (!localStorage.getItem('token')) {
        console.log(localStorage.getItem('token'))
        router.push('/login')
    }

})
</script>
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
