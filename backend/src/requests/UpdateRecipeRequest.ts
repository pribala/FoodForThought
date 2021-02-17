/**
 * Fields in a request to update a weekly plan item.
 */
export interface UpdateRecipeRequest {
  description?: string,
  category?: string,
  likes: number,
  unlike: number,
  userId?: string
}