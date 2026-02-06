/**
 * 收藏功能组合式函数
 *
 * 提供收藏列表、添加/取消收藏、检查收藏状态等功能
 */

import { ref, computed } from 'vue'
import { getApi } from '../api'
import { FavoritesService } from '../api/services/favorites.service'
import type { Favorite, FavoriteType } from '../api/services/favorites.service'

/**
 * 收藏功能组合式函数
 */
export function useFavorites() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 当前选中的类型
  const selectedType = ref<FavoriteType>('recipe')

  // 收藏列表
  const favorites = ref<Favorite[]>([])

  // 计算属性 - 按类型分组的收藏
  const recipes = computed(() => {
    return favorites.value.filter(f => f.type === 'recipe').map(f => ({
      id: f.id,
      itemId: f.itemId,
      name: f.item?.name || '未知食谱',
      image: f.item?.image || '',
      calories: f.item?.calories || 0,
      createdAt: f.createdAt
    }))
  })

  const foods = computed(() => {
    return favorites.value.filter(f => f.type === 'food').map(f => ({
      id: f.id,
      itemId: f.itemId,
      name: f.item?.name || '未知食材',
      image: f.item?.image || '',
      calories: f.item?.calories || 0,
      createdAt: f.createdAt
    }))
  })

  // 当前显示的列表（根据选中类型）
  const currentList = computed(() => {
    return selectedType.value === 'recipe' ? recipes.value : foods.value
  })

  // 是否为空
  const isEmpty = computed(() => currentList.value.length === 0)

  /**
   * 获取收藏列表
   */
  async function fetchFavorites(type?: FavoriteType) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const favoritesService = new FavoritesService(api)

      const response = await favoritesService.getFavorites(type)
      favorites.value = response.favorites

      if (type) {
        selectedType.value = type
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取收藏失败'
      console.error('fetchFavorites error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 添加收藏
   */
  async function addFavorite(itemId: string, type: FavoriteType) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const favoritesService = new FavoritesService(api)

      const favorite = await favoritesService.addFavorite(itemId, type)
      favorites.value.push(favorite)

      return favorite
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加收藏失败'
      console.error('addFavorite error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 取消收藏
   */
  async function removeFavorite(id: string) {
    loading.value = true
    error.value = null

    try {
      const api = getApi()
      const favoritesService = new FavoritesService(api)

      await favoritesService.removeFavorite(id)

      // 从本地列表移除
      favorites.value = favorites.value.filter(f => f.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '取消收藏失败'
      console.error('removeFavorite error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换类型标签
   */
  async function switchType(type: FavoriteType) {
    selectedType.value = type
    await fetchFavorites(type)
  }

  /**
   * 检查是否已收藏
   */
  async function checkFavorited(itemId: string, type?: FavoriteType): Promise<boolean> {
    try {
      const api = getApi()
      const favoritesService = new FavoritesService(api)

      const response = await favoritesService.checkFavorited(itemId, type)
      return response.isFavorited
    } catch {
      return false
    }
  }

  /**
   * 切换收藏状态（收藏/取消收藏）
   */
  async function toggleFavorite(itemId: string, type: FavoriteType) {
    const isFavorited = await checkFavorited(itemId, type)

    if (isFavorited) {
      // 找到对应的收藏项并移除
      const favorite = favorites.value.find(f => f.itemId === itemId && f.type === type)
      if (favorite) {
        await removeFavorite(favorite.id)
      }
      return false
    } else {
      await addFavorite(itemId, type)
      return true
    }
  }

  /**
   * 刷新列表
   */
  function refresh() {
    return fetchFavorites(selectedType.value)
  }

  return {
    loading,
    error,
    selectedType,
    favorites,
    recipes,
    foods,
    currentList,
    isEmpty,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    switchType,
    checkFavorited,
    toggleFavorite,
    refresh,
  }
}
