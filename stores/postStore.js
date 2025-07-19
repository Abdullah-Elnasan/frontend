import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePostStore = defineStore('usePost', () => {
    const posts = ref([]);

    function setPosts(newPosts) {
        console.log(newPosts)
        const uniquePosts = newPosts.filter(
            newPost => !posts.value.some(post => post.id === newPost.id)
        );
        posts.value.push(...uniquePosts);
    }

    function getPost(id) {
        console.log(id.value)
        const test = posts.value.find((post) => {
            console.log(post.id === id.value)
            return post.id === id.value
        })
        console.log(test)
        return test
    }


    return {
        posts,
        setPosts,
        getPost,
    };
});
