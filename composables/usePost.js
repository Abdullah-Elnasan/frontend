// frontend/composables/usePost.js
// ~/composables/usePost.js
export async function usePost(slug) {
  const config = useRuntimeConfig()
  const error = ref(null)
  const pending = ref(false)
  const post = ref(null)
  try{
    const res = await fetch(`${config.public.apiBase}/posts/${slug}`)
      const data = await res.json()
      post.value = data 
      console.log(post.value)
  }catch (err) {
      error.value = err
    } finally {
      pending.value = false
    }
  
  return {
    post,
    error,
    pending,
  }
}
