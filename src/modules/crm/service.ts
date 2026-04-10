import { MedusaService } from "@medusajs/framework/utils"
import CustomerNote from "./models/customer-note"
import CustomerTask from "./models/customer-task"
import CustomerActivity from "./models/customer-activity"

class CrmModuleService extends MedusaService({
  CustomerNote,
  CustomerTask,
  CustomerActivity,
}) {}

export default CrmModuleService
