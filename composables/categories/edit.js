export async function updateCate(postData) {
  const config = useRuntimeConfig()

  try {
    // جلب التوكن من localStorage
    const token = localStorage.getItem('token') || ''

    // استخراج الـ id من الـ FormData (postData)
    const id = postData.id
    if (!id) throw new Error('معرّف الفئة غير موجود')

    const response = await fetch(`${config.public.apiBase}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'فشل في تعديل الفئة')
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
