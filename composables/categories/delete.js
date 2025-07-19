export async function deleteCategory(id) {
    const config = useRuntimeConfig()

    try {
        const token = localStorage.getItem('token') || ''

        const response = await fetch(`${config.public.apiBase}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'فشل في حذف الفئة')
        }

        return { success: true, error: null }
    } catch (error) {
        return { success: false, error }
    }
}
