export async function createPost(postData) {
  const config = useRuntimeConfig()

  try {
    // جلب التوكن من localStorage
    const token = localStorage.getItem('token') || ''

    const response = await fetch(`${config.public.apiBase}/posts`, {
      method: 'POST',
      body: postData,
      headers: {
        // لا تضف content-type هنا لأن body من نوع FormData وسيتم تعيينه تلقائيًا من المتصفح
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'فشل في إنشاء المقال')
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
