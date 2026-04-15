import CrmModule from "./modules/crm"
import CampaignService from "./modules/crm/service/campaign"

export default {
  id: "crm",
  modules: [CrmModule],
  services: [
    {
      key: "campaignService",
      resolve: CampaignService,
    },
  ],
}
