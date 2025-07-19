// export function usePosts() {
//   const config = useRuntimeConfig()

//   const { data, error, pending } = useFetch(() => `${config.public.apiBase}/posts`, {
//     key: 'posts',
//     server: true,
//     lazy: false
//   })

//   const posts = computed(() => data.value ?? [])

//   return { posts, error, pending }
// }


export function usePosts() {
  const posts = ref([])
  const error = ref(null)
  const pending = ref(false)
  const page = ref(1)
  const noMore = ref(false)
  const config = useRuntimeConfig()

  async function loadMore() {
    if (pending.value || noMore.value) return

    pending.value = true
    try {
      const res = await fetch(`${config.public.apiBase}/posts?page=${page.value}`)
      const data = await res.json()
      const newPosts = data.posts || []
      const limit = data.limit || 15;
      if (data.total && data.total < limit) {
        noMore.value = true
      }

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
}
