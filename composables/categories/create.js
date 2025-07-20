export async function createCategory(postData) {
  const config = useRuntimeConfig()
  try {
    // جلب التوكن من localStorage
    const token = localStorage.getItem('token') || ''

const response = await fetch(`${config.public.apiBase}/categories`, {
  method: 'POST',
  body: JSON.stringify(postData),  // ✅ تستخدم JSON
  headers: {
    'Content-Type': 'application/json', // ✅ ضروري هنا
    'Authorization': `Bearer ${token}`
  }
});


    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'فشل في إنشاء الفئة')
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
