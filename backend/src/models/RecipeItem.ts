export interface RecipeItem {
  userId: string
  recipeId: string
  title: string
  category: string
  description: string
  likes: number
  likedBy?: string[]
  dislikedBy?: string[]
  recipeUrl?: string
}
