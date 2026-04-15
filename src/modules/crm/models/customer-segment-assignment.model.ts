import { model } from "@medusajs/framework/utils"

const CustomerSegmentAssignment = model.define("customer_segment_assignment", {
  id: model.id({ prefix: "csa" }).primaryKey(),
  customer_id: model.text(),
  segment_id: model.text(),
  assigned_by: model.text().nullable(),
})

export default CustomerSegmentAssignment
