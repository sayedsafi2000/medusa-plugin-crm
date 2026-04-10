import { Module } from "@medusajs/framework/utils"
import CrmModuleService from "./service"

export const CRM_MODULE = "crm"
export const crmModuleService = CRM_MODULE

export default Module(CRM_MODULE, {
  service: CrmModuleService,
})

export interface CRMModuleOptions {
  // Add any module configuration options here
}
