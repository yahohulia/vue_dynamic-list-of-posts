<script setup>
import { deleteComment } from "@/api/comments";
import useCommentsStore from "@/stores/commentsStore";
import usePostsStore from "@/stores/postsStore";

const commentsStore = useCommentsStore();
const postStore = usePostsStore();

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  postId: Number,
});

const handleDelete = async () => {
  commentsStore.removeComment(props.comment.id, postStore.activePostId);

  try {
    await deleteComment(props.comment.id);
  } catch (error) {
    console.error("Failed to delete comment, reverting:", error);
    commentsStore.addComment(props.comment, props.postId);
  }
};
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`"> {{ comment.name }} </a>
      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="handleDelete"
      ></button>
    </div>
    <div class="message-body">{{ comment.body }}</div>
  </article>
</template>
