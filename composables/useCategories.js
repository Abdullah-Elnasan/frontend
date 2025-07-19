export function useCategories() {
    const categories = ref([]);
    const error = ref(null);
    const pending = ref(false);
    const config = useRuntimeConfig();

    async function loadCategories() {
        pending.value = true;
        try {
            const res = await fetch(`${config.public.apiBase}/categories`);
            if (!res.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await res.json();
            categories.value = data.categories || [];
        } catch (err) {
            error.value = err;
        } finally {
            pending.value = false;
        }
    }

    // Load categories when the composable is used
    loadCategories();

    return {
        categories,
        error,
        pending,
        loadCategories
    };
}