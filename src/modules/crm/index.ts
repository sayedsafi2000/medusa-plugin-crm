import { Module } from "@medusajs/framework/utils"
import CrmModuleService from "./service"

/** Awilix key for `CrmModuleService` (same value used in `container.resolve`) */
export const CRM_MODULE = "crmModuleService"
/** @deprecated Use `CRM_MODULE` — kept for backwards compatibility with existing imports */
export const crmModuleService = CRM_MODULE

export default Module(CRM_MODULE, {
  service: CrmModuleService,
})

export interface CRMModuleOptions {
  // Add any module configuration options here
}
