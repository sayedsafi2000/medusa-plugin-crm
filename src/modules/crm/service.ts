import { MedusaService } from "@medusajs/framework/utils"
import CustomerNote from "./models/customer-note"
import CustomerTask from "./models/customer-task"
import CustomerActivity from "./models/customer-activity"
import CustomerSegment from "./models/customer-segment"
import CustomerTag from "./models/customer-tag"
import CustomerTagAssignment from "./models/customer-tag-assignment"
import CustomerSegmentAssignment from "./models/customer-segment-assignment"
import Lead from "./models/lead"
import CommunicationLog from "./models/communication-log"
import CrmCampaign from "./models/campaign"
import Automation from "./models/automation"
import Notification from "./models/notification"
import CrmSetting from "./models/crm-setting"
import ErrorLog from "./models/error-log"
import CrmRole from "./models/crm-role"

class CrmModuleService extends MedusaService({
  CustomerNote,
  CustomerTask,
  CustomerActivity,
  CustomerSegment,
  CustomerTag,
  CustomerTagAssignment,
  CustomerSegmentAssignment,
  Lead,
  CommunicationLog,
  CrmCampaign,
  Automation,
  Notification,
  CrmSetting,
  ErrorLog,
  CrmRole,
}) {}

export default CrmModuleService
