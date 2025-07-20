<script setup>
import { useToast } from '#imports'
import { useRouter } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { login } from '../composables/auth'

definePageMeta({
    layout: false
})

const toast = useToast()
const router = useRouter()

const state = reactive({
    email: '',
    password: ''
})

const validate = () => {
    const errors = []
    if (!state.email) errors.push('الإيميل مطلوب')
    if (!state.password) errors.push('كلمة المرور مطلوبة')
    return errors
}

async function onSubmit(event) {
    event.preventDefault() // منع إعادة تحميل الصفحة
    const errors = validate()
    if (errors.length) {
        toast.add({ title: 'خطأ في الإدخال', description: errors.join(' - '), color: 'red' })
        return
    }

    try {
        const res = await login({ email: state.email, password: state.password })
        if(res.token){
            localStorage.setItem('token', res.token)
            toast.add({ title: 'تم الدخول', description: 'تم تسجيل الدخول بنجاح.', color: 'success' })
            router.push('/admin/posts')
        }
    } catch (error) {
        toast.add({ title: 'خطأ', description: 'فشل تسجيل الدخول. تحقق من البيانات.', color: 'red' })
    }
}

onMounted(() => {
    if (localStorage.getItem('token')) {
        router.push('/admin/posts')
    }
})
</script>

<template>
    <div class="container" dir="rtl">
        <div class="form-box">
            <h1 class="form-title">مدونة علاء البيطار</h1>

            <form @submit="onSubmit">
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input id="email" type="text" v-model="state.email" class="input" />
                </div>

                <div class="form-group">
                    <label for="password">كلمة المرور</label>
                    <input id="password" type="password" v-model="state.password" class="input" />
                </div>

                <button type="submit" class="submit-button">تسجيل الدخول</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f3f3f3;
}

.form-box {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    direction: rtl;
}

.form-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
}

.input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
}

.submit-button {
    width: 100%;
    background-color: #007bff;
    color: white;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
}

.submit-button:hover {
    background-color: #0056b3;
}
</style>
