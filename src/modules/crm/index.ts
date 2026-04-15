import CrmModuleService from "./service"
import * as Models from "./models"

export default {
  service: CrmModuleService,
  key: "crm",
  // Added serviceName to satisfy Medusa's module requirements
  serviceName: "crm",
}
