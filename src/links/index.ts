import { defineLink } from "@medusajs/framework/utils"
import CrmModule from "../modules/crm"
import CustomerModule from "@medusajs/medusa/customer"

const customerTagLink = defineLink(
  {
    linkable: CrmModule.linkable.customerTag,
    isList: true,
  },
  CustomerModule.linkable.customer
)

const customerSegmentLink = defineLink(
  {
    linkable: CrmModule.linkable.customerSegment,
    isList: true,
  },
  CustomerModule.linkable.customer
)

export default [customerTagLink, customerSegmentLink]
