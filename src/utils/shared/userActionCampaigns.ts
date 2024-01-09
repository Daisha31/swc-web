import { UserActionType } from '@prisma/client'

export enum UserActionEmailCampaignName {
  DEFAULT = 'DEFAULT',
}
export enum UserActionCallCampaignName {
  DEFAULT = 'DEFAULT',
}
export enum UserActionDonationCampaignName {
  DEFAULT = 'DEFAULT',
}
export enum UserActionOptInCampaignName {
  DEFAULT = 'DEFAULT',
}
export enum UserActionTweetCampaignName {
  DEFAULT = 'DEFAULT',
}
export enum UserActionNftMintCampaignName {
  DEFAULT = 'DEFAULT',
}

export const USER_ACTION_TO_CAMPAIGN_NAME_MAP = {
  [UserActionType.EMAIL]: UserActionEmailCampaignName,
  [UserActionType.CALL]: UserActionCallCampaignName,
  [UserActionType.DONATION]: UserActionDonationCampaignName,
  [UserActionType.OPT_IN]: UserActionOptInCampaignName,
  [UserActionType.TWEET]: UserActionTweetCampaignName,
  [UserActionType.NFT_MINT]: UserActionNftMintCampaignName,
} satisfies Record<UserActionType, any>

export const USER_ACTION_TO_CAMPAIGN_NAME_DEFAULT_MAP = {
  [UserActionType.EMAIL]: UserActionEmailCampaignName.DEFAULT,
  [UserActionType.CALL]: UserActionCallCampaignName.DEFAULT,
  [UserActionType.DONATION]: UserActionDonationCampaignName.DEFAULT,
  [UserActionType.OPT_IN]: UserActionOptInCampaignName.DEFAULT,
  [UserActionType.TWEET]: UserActionTweetCampaignName.DEFAULT,
  [UserActionType.NFT_MINT]: UserActionNftMintCampaignName.DEFAULT,
} satisfies Record<UserActionType, string>
