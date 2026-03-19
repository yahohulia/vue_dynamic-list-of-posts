import {
  createPost,
  deletePost,
  getPostById,
  getPostsByUserId,
} from "@/api/posts";
import { defineStore } from "pinia";
import { ref } from "vue";

const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const activePostId = ref(null);
  const isLoading = ref(false);

  const init = (userId) => {
    const saved = localStorage.getItem(`posts-${userId}`);
    if (saved) {
      posts.value = JSON.parse(saved);
    }
  };

  const getPostByIdFromServer = async (postId) => {
    try {
      const response = await getPostById(postId);

      return response.data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      return null;
    }
  };

  const setActivePost = (postId) => {
    if (activePostId.value === postId) {
      activePostId.value = null;
    } else {
      activePostId.value = postId;
    }
  };

  const fetchPostsByUserId = async (userId) => {
    isLoading.value = true;

    try {
      const response = await getPostsByUserId(userId);

      posts.value = response.data;
      localStorage.setItem(`posts-${userId}`, JSON.stringify(posts.value));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const addPost = async (postData) => {
    try {
      const response = await createPost(postData);

      posts.value.push(response.data);
      localStorage.setItem(
        `posts-${response.data.userId}`,
        JSON.stringify(posts.value),
      );
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  };

  const removePost = async (postId, userId) => {
    try {
      await deletePost(postId);

      posts.value = posts.value.filter((post) => post.id !== postId);
      localStorage.setItem(`posts-${userId}`, JSON.stringify(posts.value));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const updatePost = async (postId, updateData) => {
    try {
      const response = await updatePost(postId, updateData);
      const updatedPost = response.data;
      const index = posts.value.findIndex((post) => post.id === postId);

      if (index !== -1) {
        posts.value[index] = updatedPost;
      }

      localStorage.setItem(
        `posts-${updatedPost.userId}`,
        JSON.stringify(posts.value),
      );
    } catch {
      console.error("Error updating post:", error);
    }
  };

  return {
    posts,
    activePostId,
    isLoading,
    init,
    addPost,
    getPostByIdFromServer,
    setActivePost,
    fetchPostsByUserId,
    removePost,
    updatePost,
  };
});

export default usePostsStore;
