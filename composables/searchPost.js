
export async function searchPost(query) {
    const posts = ref([])
const error = ref(null)
const pending = ref(false)
const page = ref(1)
const noMore = ref(false)
const config = useRuntimeConfig()


    // تحقق من أن query ليست undefined أو فارغة
    if (!query || query.trim() === '') {
        console.log('No valid search query provided, skipping request');
        return { posts: [], error: null, pending: false };
    }

    async function loadMore() {
    if (pending.value || noMore.value) return

    pending.value = true
    try {
      const res = await fetch(`${config.public.apiBase}/posts?page=${page.value}`)
      const data = await res.json()
      const newPosts = data.posts || []

      if (newPosts.length === 0) {
        noMore.value = true
      } else {
        posts.value = [...posts.value, ...newPosts]
        page.value += 1
      }
    } catch (err) {
      error.value = err
    } finally {
      pending.value = false
    }
  }

  // ❌ لا تستدعِ loadMore مباشرة
  return {
    posts,
    error,
    pending,
    loadMore,
    noMore
  }

    // ترميز query
    const encodedQuery = encodeURIComponent(query.trim());
   

    try {
        const posts = await $fetch(`${config.public.apiBase}/posts?search=${encodedQuery}`);
        return { posts, error: null, pending: false };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { posts: [], error, pending: false };
    }
}