/**
 * Fields in a request to create weekly plan item.
 */
export interface CreatePlanRequest {
  weekId: string
  weekDay: string
  target: number
  activities?: string
}
