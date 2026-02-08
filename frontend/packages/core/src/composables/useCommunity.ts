/**
 * 社区功能组合式函数
 *
 * 提供社区帖子列表、发布帖子、点赞、评论等功能
 */

import { ref, computed } from "vue";
import { getApi } from "../api";
import { CommunityService } from "../api/services/community.service";
import type { Post, Comment } from "../api/services/community.service";

/**
 * 社区功能组合式函数
 */
export function useCommunity() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 帖子列表
  const posts = ref<Post[]>([]);

  // 分页信息
  const currentPage = ref(1);
  const pageSize = ref(20);
  const total = ref(0);

  // 当前选中的标签
  const selectedTag = ref<string | undefined>(undefined);

  // 是否还有更多数据
  const hasMore = computed(() => posts.value.length < total.value);

  // 是否为空
  const isEmpty = computed(() => posts.value.length === 0 && !loading.value);

  /**
   * 获取帖子列表
   */
  async function fetchPosts(page = 1, limit?: number, tag?: string) {
    loading.value = true;
    error.value = null;

    try {
      const api = getApi();
      const communityService = new CommunityService(api);

      const response = await communityService.getPosts(page, limit || pageSize.value, tag || selectedTag.value);

      if (page === 1) {
        posts.value = response.posts;
      } else {
        posts.value.push(...response.posts);
      }

      currentPage.value = response.page;
      total.value = response.total;

      if (tag !== undefined) {
        selectedTag.value = tag;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取帖子失败";
      console.error("fetchPosts error:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 加载更多帖子
   */
  async function loadMore() {
    if (loading.value || !hasMore.value) return;
    await fetchPosts(currentPage.value + 1);
  }

  /**
   * 发布帖子
   */
  async function createPost(content: string, images?: string[], tags?: string[]) {
    loading.value = true;
    error.value = null;

    try {
      const api = getApi();
      const communityService = new CommunityService(api);

      const post = await communityService.createPost(content, images, tags);
      posts.value.unshift(post);

      return post;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "发布失败";
      console.error("createPost error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 点赞/取消点赞
   */
  async function toggleLike(postId: string) {
    try {
      const api = getApi();
      const communityService = new CommunityService(api);

      const updatedPost = await communityService.toggleLike(postId);

      // 更新本地状态 - 后端返回的是更新后的完整 Post 对象
      const post = posts.value.find((p) => p.id === postId);
      if (post) {
        post.isLiked = updatedPost.isLiked;
        post.likes = updatedPost.likes;
      }

      return updatedPost;
    } catch (err) {
      console.error("toggleLike error:", err);
      throw err;
    }
  }

  /**
   * 添加评论
   */
  async function addComment(postId: string, content: string) {
    try {
      const api = getApi();
      const communityService = new CommunityService(api);

      const comment = await communityService.addComment(postId, content);

      // 更新本地帖子评论数（如果有的话）
      const post = posts.value.find((p) => p.id === postId);
      if (post) {
        // Post 类型中没有 comments 字段，但可能在 UI 层显示
        // 这里暂不处理
      }

      return comment;
    } catch (err) {
      console.error("addComment error:", err);
      throw err;
    }
  }

  /**
   * 删除帖子
   */
  async function deletePost(postId: string) {
    loading.value = true;
    error.value = null;

    try {
      const api = getApi();
      const communityService = new CommunityService(api);

      await communityService.deletePost(postId);

      // 从本地列表移除
      posts.value = posts.value.filter((p) => p.id !== postId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "删除失败";
      console.error("deletePost error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取我的帖子
   */
  async function fetchMyPosts() {
    loading.value = true;
    error.value = null;

    try {
      const api = getApi();
      const communityService = new CommunityService(api);

      posts.value = await communityService.getMyPosts();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取我的帖子失败";
      console.error("fetchMyPosts error:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 按标签筛选
   */
  async function filterByTag(tag: string) {
    selectedTag.value = tag;
    await fetchPosts(1, pageSize.value, tag);
  }

  /**
   * 清除标签筛选
   */
  async function clearTagFilter() {
    selectedTag.value = undefined;
    await fetchPosts(1, pageSize.value);
  }

  /**
   * 刷新列表
   */
  function refresh() {
    return fetchPosts(1);
  }

  return {
    loading,
    error,
    posts,
    currentPage,
    pageSize,
    total,
    selectedTag,
    hasMore,
    isEmpty,
    fetchPosts,
    loadMore,
    createPost,
    toggleLike,
    addComment,
    deletePost,
    fetchMyPosts,
    filterByTag,
    clearTagFilter,
    refresh,
  };
}
