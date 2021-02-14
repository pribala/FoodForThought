/**
 * Fields in a request to update a weekly plan item.
 */
export interface UpdatePlanRequest {
  weekId: string,
  weekDay: string,
  achieved: string
}