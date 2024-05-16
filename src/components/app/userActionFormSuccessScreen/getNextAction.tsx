'use client'

import { UserActionType } from '@prisma/client'

import { GetUserPerformedUserActionTypesResponse } from '@/app/api/identified-user/performed-user-action-types/route'
import { USER_ACTION_ROW_CTA_INFO } from '@/components/app/userActionRowCTA/constants'
import { USER_ACTION_TO_CAMPAIGN_NAME_DEFAULT_MAP } from '@/utils/shared/userActionCampaigns'
import { USER_ACTION_TYPE_CTA_PRIORITY_ORDER } from '@/utils/web/userActionUtils'

export function getNextAction(
  performedUserActionTypes: GetUserPerformedUserActionTypesResponse['performedUserActionTypes'],
) {
  const action = USER_ACTION_TYPE_CTA_PRIORITY_ORDER.filter(x => x !== UserActionType.OPT_IN).find(
    userAction =>
      !performedUserActionTypes.some(
        performedAction =>
          performedAction.actionType === userAction &&
          performedAction.campaignName === USER_ACTION_TO_CAMPAIGN_NAME_DEFAULT_MAP[userAction],
      ),
  )

  if (action) {
    const { WrapperComponent: _WrapperComponent, ...rest } = USER_ACTION_ROW_CTA_INFO[action]
    return rest
  }
  return null
}
