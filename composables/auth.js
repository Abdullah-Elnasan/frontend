export async function login({ email, password }) {
    const config = useRuntimeConfig()

    try {
        const res = await fetch(`${config.public.apiBase}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) // ← هذا مهم
        })

        if (!res.ok) {
            throw new Error('فشل في تسجيل الدخول')
        }
        const result = await res.json();
        return result  // ← تحليل الاستجابة كـ JSON

    } catch (error) {
        throw error
    }
}
