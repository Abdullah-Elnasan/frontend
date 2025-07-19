export async function updatePost(postData) {
  const config = useRuntimeConfig()

  try {
    // جلب التوكن من localStorage
    const token = localStorage.getItem('token') || ''

    // استخراج الـ id من الـ FormData (postData)
    const id = postData.get('id')
    if (!id) throw new Error('معرّف المقال غير موجود')

    const response = await fetch(`${config.public.apiBase}/posts/${id}`, {
      method: 'PUT',
      body: postData,
      headers: {
        // لا تضف content-type هنا لأن body من نوع FormData وسيتم تعيينه تلقائيًا من المتصفح
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'فشل في تعديل المقال')
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
