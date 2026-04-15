import CrmModuleService from "./service"
import * as Models from "./models"

export default {
  service: CrmModuleService,
  loaders: [
    {
      name: "crm_loader",
      resolve: "@medusajs/framework",
    },
  ],
}
