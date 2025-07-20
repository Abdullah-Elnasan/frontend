<template>
    <div v-if="show" class="modal-overlay" @click.self="close" dir="rtl">
        <div class="modal">
            <h2>{{ isEdit ? 'تعديل الفئة' : 'إضافة الفئة' }}</h2>

            <form @submit.prevent="submitForm">
                <label>
                    العنوان:
                    <input v-model="form.name" required />
                </label>


                <div class="buttons">
                    <button type="submit">{{ isEdit ? 'حفظ التعديلات' : 'إضافة الفئة' }}</button>
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
const { categories, loadCategories } = useCategories()
const categoriesApi = ref([])

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
    show: Boolean,
    cate: Object
})

const form = reactive({
    name: '',
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
    () => props.cate,
    (newVal) => {
        if (newVal) {
            form.name = newVal.name || ''
            isEdit.value = true
        } else {
            resetForm()
            isEdit.value = false
        }
    },
    { immediate: true }
)


function resetForm() {
    form.name = ''
}
const successMessage = ref('')
function close() {
    successMessage.value = ''
    emit('close')
}


function submitForm() {
    const postData = {}
    postData.name = form.name
    if (isEdit.value && props.cate?.id) {
        postData.id =  props.cate.id
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
