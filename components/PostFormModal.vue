<template>
    <div v-if="show" class="modal-overlay" @click.self="close" dir="rtl">
        <div class="modal">
            <h2>{{ isEdit ? 'تعديل مقال' : 'إضافة مقال' }}</h2>

            <form @submit.prevent="submitForm">
                <label>
                    العنوان:
                    <input v-model="form.title" required />
                </label>

                <label>
                    المحتوى:
                    <textarea v-model="form.content" required></textarea>
                </label>

                <label>
                    الفئة:
                    <select v-model="form.category_id" required>
                        <option disabled value="">اختر الفئة</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                </label>

                <label>
                    المحافظة:
                    <input v-model="form.governorate" required />
                </label>

                <label>
                    المدينة:
                    <input v-model="form.city" required />
                </label>

                <label>
                    تاريخ الإنشاء:
                    <input type="date" v-model="form.created_at" required />
                </label>

                <label>
                    الصورة:
                    <input type="file" @change="handleFile" />
                </label>

                <div v-if="props.post?.image && isEdit" class="image-preview">
                    <small>الصورة الحالية:</small>
                    <img :src="props.post.image" alt="صورة المقال" />
                </div>

                <div class="buttons">
                    <button type="submit">{{ isEdit ? 'حفظ التعديلات' : 'إضافة المقال' }}</button>
                    <button type="button" @click="close">إلغاء</button>
                </div>
            </form>
            <div v-if="successMessage" class="success-message mt-5">{{ successMessage }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
// import { useFetch } from '#app'
import { useCategories } from '~/composables/useCategories'
const { categories, loadCategories } = useCategories()
const categoriesApi = ref([])

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
    show: Boolean,
    post: Object
})

const form = reactive({
    title: '',
    content: '',
    category_id: '',
    governorate: '',
    city: '',
    created_at: '',
    image: null
})

const isEdit = ref(false)


onMounted(async () => {
    if (categories.value.length === 0) {
        await loadCategories()
    }

    categoriesApi.value = categories.value


})

// تعبئة النموذج عند تعديل
watch(
    () => props.post,
    (newVal) => {
        if (newVal) {
            form.title = newVal.title || ''
            form.content = newVal.content || ''
            form.category_id =
                newVal.category_id || newVal.category?.id || '' // معالجة الفئة
            form.governorate = newVal.governorate || ''
            form.city = newVal.city || ''

            if (newVal.created_at) {
                const d = new Date(newVal.created_at)
                form.created_at = d.toISOString().slice(0, 10)
            } else {
                form.created_at = ''
            }

            form.image = null // لا يمكن تعبئة input[type=file] مباشرة
            isEdit.value = true
        } else {
            resetForm()
            isEdit.value = false
        }
    },
    { immediate: true }
)

function handleFile(event) {
    const file = event.target.files[0]
    form.image = file
}

function resetForm() {
    form.title = ''
    form.content = ''
    form.category_id = ''
    form.governorate = ''
    form.city = ''
    form.created_at = ''
    form.image = null
}
const successMessage = ref('')
function close() {
    successMessage.value = ''
    emit('close')
}


function submitForm() {
    const postData = new FormData()
    postData.append('title', form.title)
    postData.append('content', form.content)
    postData.append('category_id', form.category_id)
    postData.append('governorate', form.governorate)
    postData.append('city', form.city)
    postData.append('created_at', form.created_at)

    if (form.image) {
        postData.append('image', form.image)
    }

    if (isEdit.value && props.post?.id) {
        postData.append('id', props.post.id)
    }

    emit('submit', postData, setSuccessMessage)
    
}

function setSuccessMessage(msg) {
    successMessage.value = msg
    // بعد 3 ثواني نخفي الرسالة ونغلق المودال
    setTimeout(() => {
        successMessage.value = ''
        close()
    }, 3000)
}
</script>
<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding-top: 65px;
    overflow-y: auto;
}

.modal {
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

input,
textarea,
select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

textarea {
    height: 200px;
}

.image-preview {
    margin-top: 8px;
}

.image-preview img {
    max-width: 25%;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-top: 4px;
}

.buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 12px;
}

button {
    padding: 8px 16px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

button[type="submit"] {
    background-color: #10b981;
    color: white;
}

button[type="button"] {
    background-color: #ccc;
}


.success-message {
    background-color: #10b981;
    color: white;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    text-align: center;
}
</style>
