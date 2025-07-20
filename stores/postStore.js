import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePostStore = defineStore('usePost', () => {
    const posts = ref([]);

    function setPosts(newPosts) {
        const uniquePosts = newPosts.filter(
            newPost => !posts.value.some(post => post.id === newPost.id)
        );
        posts.value.push(...uniquePosts);
    }

    function getPost(id) {
        const test = posts.value.find((post) => {
            return post.id === id.value
        })
        return test
    }


    return {
        posts,
        setPosts,
        getPost,
    };
});
