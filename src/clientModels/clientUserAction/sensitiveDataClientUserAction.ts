import {
  Address,
  NFTMint,
  UserAction,
  UserActionCall,
  UserActionDonation,
  UserActionEmail,
  UserActionEmailRecipient,
  UserActionOptIn,
  UserActionTweetAtPerson,
  UserActionType,
  UserActionVoterRegistration,
} from '@prisma/client'

import { ClientAddress, getClientAddress } from '@/clientModels/clientAddress'
import { ClientNFTMint, getClientNFTMint } from '@/clientModels/clientNFTMint'
import { ClientModel, getClientModel } from '@/clientModels/utils'

/*
Assumption: we will always want to interact with the user actions and their related type joins together
If this ever changes, we may need to export the SensitiveDataClientUserActionEmail, SensitiveDataClientUserActionCall, etc fns
*/

type SensitiveDataClientUserActionDatabaseQuery = UserAction & {
  userActionEmail:
    | (UserActionEmail & {
        address: Address
        userActionEmailRecipients: UserActionEmailRecipient[]
      })
    | null
  nftMint: NFTMint | null
  userActionCall: UserActionCall | null
  userActionDonation: UserActionDonation | null
  userActionOptIn: UserActionOptIn | null
  userActionVoterRegistration: UserActionVoterRegistration | null
  userActionTweetAtPerson: UserActionTweetAtPerson | null
}

type SensitiveDataClientUserActionEmailRecipient = Pick<UserActionEmailRecipient, 'id'>
type SensitiveDataClientUserActionEmail = Pick<
  UserActionEmail,
  'senderEmail' | 'firstName' | 'lastName'
> & {
  // all SensitiveDataClientUserActionEmail should have addresses, but we want to gracefully fail if google starts hard-capping us for some reason
  address: ClientAddress | null
  userActionEmailRecipients: SensitiveDataClientUserActionEmailRecipient[]
  actionType: typeof UserActionType.EMAIL
}
type SensitiveDataClientUserActionCall = Pick<UserActionCall, 'recipientPhoneNumber'> & {
  actionType: typeof UserActionType.CALL
}
type SensitiveDataClientUserActionDonation = Pick<
  UserActionDonation,
  'amountCurrencyCode' | 'recipient'
> & {
  amount: number
  amountUsd: number
  actionType: typeof UserActionType.DONATION
}
type SensitiveDataClientUserActionNFTMint = {
  nftMint: ClientNFTMint
  actionType: typeof UserActionType.NFT_MINT
}
type SensitiveDataClientUserActionOptIn = Pick<UserActionOptIn, 'optInType'> & {
  actionType: typeof UserActionType.OPT_IN
}
// Added here as a placeholder for type inference until we have some tweet-specific fields
type SensitiveDataClientUserActionTweet = { actionType: typeof UserActionType.TWEET }

type SensitiveDataClientUserActionVoterRegistration = Pick<
  UserActionVoterRegistration,
  'usaState'
> & {
  actionType: typeof UserActionType.VOTER_REGISTRATION
}

type SensitiveDataClientUserActionLiveEvent = { actionType: typeof UserActionType.LIVE_EVENT }

type SensitiveDataClientUserActionTweetAtPerson = {
  actionType: typeof UserActionType.TWEET_AT_PERSON
  recipientDtsiSlug: string | null
}

/*
At the database schema level we can't enforce that a single action only has one "type" FK, but at the client level we can and should
*/
export type SensitiveDataClientUserAction = ClientModel<
  Pick<UserAction, 'id' | 'actionType'> & {
    nftMint: ClientNFTMint | null
    datetimeCreated: string
  } & (
      | SensitiveDataClientUserActionTweet
      | SensitiveDataClientUserActionOptIn
      | SensitiveDataClientUserActionEmail
      | SensitiveDataClientUserActionCall
      | SensitiveDataClientUserActionDonation
      | SensitiveDataClientUserActionNFTMint
      | SensitiveDataClientUserActionVoterRegistration
      | SensitiveDataClientUserActionLiveEvent
      | SensitiveDataClientUserActionTweetAtPerson
    )
>

const getRelatedModel = <K extends keyof SensitiveDataClientUserActionDatabaseQuery>(
  record: SensitiveDataClientUserActionDatabaseQuery,
  key: K,
) => {
  const val = record[key]
  if (!val) {
    throw new Error(
      `getRelatedModel: no ${key} found for id ${record.id} of type ${record.actionType}`,
    )
  }
  return val
}

export const getSensitiveDataClientUserAction = ({
  record,
}: {
  record: SensitiveDataClientUserActionDatabaseQuery
}): SensitiveDataClientUserAction => {
  const { id, datetimeCreated, actionType, nftMint } = record
  const sharedProps = {
    id,
    datetimeCreated: datetimeCreated.toISOString(),
    actionType,
    nftMint: nftMint
      ? {
          ...getClientNFTMint(nftMint),
        }
      : null,
  }

  const actionTypes: { [key in UserActionType]: () => ClientModel<SensitiveDataClientUserAction> } =
    {
      [UserActionType.OPT_IN]: () => {
        const { optInType } = getRelatedModel(record, 'userActionOptIn')
        const callFields: SensitiveDataClientUserActionOptIn = {
          optInType,
          actionType: UserActionType.OPT_IN,
        }
        return getClientModel({ ...sharedProps, ...callFields })
      },
      [UserActionType.CALL]: () => {
        const { recipientPhoneNumber } = getRelatedModel(record, 'userActionCall')
        const callFields: SensitiveDataClientUserActionCall = {
          recipientPhoneNumber,
          actionType: UserActionType.CALL,
        }
        return getClientModel({ ...sharedProps, ...callFields })
      },
      [UserActionType.DONATION]: () => {
        const { amount, amountCurrencyCode, amountUsd, recipient } = getRelatedModel(
          record,
          'userActionDonation',
        )
        const donationFields: SensitiveDataClientUserActionDonation = {
          amount: amount.toNumber(),
          amountUsd: amountUsd.toNumber(),
          amountCurrencyCode,
          actionType: UserActionType.DONATION,
          recipient,
        }
        return getClientModel({ ...sharedProps, ...donationFields })
      },
      [UserActionType.EMAIL]: () => {
        const { senderEmail, firstName, lastName, address, userActionEmailRecipients } =
          getRelatedModel(record, 'userActionEmail')
        const emailFields: SensitiveDataClientUserActionEmail = {
          actionType: UserActionType.EMAIL,
          senderEmail,
          firstName,
          lastName,
          address: getClientAddress(address),
          userActionEmailRecipients: userActionEmailRecipients.map(x => ({
            id: x.id,
          })),
        }
        return getClientModel({ ...sharedProps, ...emailFields })
      },
      [UserActionType.NFT_MINT]: () => {
        const mintFields: SensitiveDataClientUserActionNFTMint = {
          actionType: UserActionType.NFT_MINT,
          nftMint: sharedProps.nftMint!,
        }
        return getClientModel({ ...sharedProps, ...mintFields })
      },
      [UserActionType.TWEET]: () => {
        return getClientModel({ ...sharedProps, actionType: UserActionType.TWEET })
      },
      [UserActionType.VOTER_REGISTRATION]: () => {
        const { usaState } = getRelatedModel(record, 'userActionVoterRegistration')
        const voterRegistrationFields: SensitiveDataClientUserActionVoterRegistration = {
          usaState,
          actionType: UserActionType.VOTER_REGISTRATION,
        }
        return getClientModel({ ...sharedProps, ...voterRegistrationFields })
      },
      [UserActionType.LIVE_EVENT]: () => {
        return getClientModel({ ...sharedProps, actionType: UserActionType.LIVE_EVENT })
      },
      [UserActionType.TWEET_AT_PERSON]: () => {
        const { recipientDtsiSlug } = getRelatedModel(record, 'userActionTweetAtPerson')
        const tweetAtPersonFields: SensitiveDataClientUserActionTweetAtPerson = {
          recipientDtsiSlug,
          actionType: UserActionType.TWEET_AT_PERSON,
        }
        return getClientModel({ ...sharedProps, ...tweetAtPersonFields })
      },
    }

  const getSensitiveDataClientUserActionFromActionType = actionTypes[actionType]

  if (!getSensitiveDataClientUserActionFromActionType) {
    throw new Error(`getSensitiveDataClientUserAction: no user action fk found for id ${id}`)
  }

  return getSensitiveDataClientUserActionFromActionType()
}
