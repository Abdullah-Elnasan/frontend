export async function deletePost(id) {
    const config = useRuntimeConfig()

    try {
        const token = localStorage.getItem('token') || ''

        const response = await fetch(`${config.public.apiBase}/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'فشل في حذف المقال')
        }

        return { success: true, error: null }
    } catch (error) {
        return { success: false, error }
    }
}
