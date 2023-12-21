import { ClientCryptoAddressUser } from '@/clientModels/clientCryptoAddress/clientCryptoAddressUser'
import { ClientUserAction } from '@/clientModels/clientUserAction/clientUserAction'
import { FormattedCurrency } from '@/components/ui/formattedCurrency'
import { FormattedRelativeDatetime } from '@/components/ui/formattedRelativeDatetime'
import { DTSIPersonForUserActions } from '@/data/dtsi/queries/queryDTSIPeopleBySlugForUserActions'
import { SupportedLocale } from '@/intl/locales'
import { formatDonationOrganization } from '@/utils/web/donationUtils'
import { gracefullyError } from '@/utils/shared/gracefullyError'
import { UserActionOptInType, UserActionType } from '@prisma/client'
import {
  dtsiPersonFullName,
  dtsiPersonPoliticalAffiliationCategoryAbbreviation,
} from '@/utils/dtsi/dtsiPersonUtils'
import { CryptoAddressUserAvatar } from '@/components/app/cryptoAddressUserAvatar'
import { getCryptoAddressUserDisplayName } from '@/utils/web/cryptoAddressUserUtils'

interface RecentActivityRowProps {
  action: ClientUserAction & { cryptoAddressUser: ClientCryptoAddressUser | null }
  locale: SupportedLocale
}

function RecentActivityRowBase({
  locale,
  action,
  children,
}: RecentActivityRowProps & { children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-5">
      <div className="flex items-center gap-2">
        <div>
          <CryptoAddressUserAvatar size={30} cryptoAddressUser={action.cryptoAddressUser} />
        </div>
        <div>{children}</div>
      </div>
      <div className="shrink-0 text-xs text-gray-500">
        <FormattedRelativeDatetime date={action.datetimeOccurred} locale={locale} />
      </div>
    </div>
  )
}

const MainText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-bold text-gray-900">{children}</div>
)
const SubText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs text-gray-500">{children}</div>
)

const formatDTSIPerson = (person: DTSIPersonForUserActions) => {
  // TODO add their current role
  const politicalAffiliation = person.politicalAffiliationCategory
    ? `(${dtsiPersonPoliticalAffiliationCategoryAbbreviation(person.politicalAffiliationCategory)})`
    : ''
  return `${dtsiPersonFullName(person)} ${politicalAffiliation}`
}

export function RecentActivityRow(props: RecentActivityRowProps) {
  const { action, locale } = props
  const userDisplayName = getCryptoAddressUserDisplayName(props.action.cryptoAddressUser)
  const getChild = () => {
    switch (action.actionType) {
      case UserActionType.OPT_IN: {
        const getTypeDisplayText = () => {
          switch (action.optInType) {
            case UserActionOptInType.SWC_SIGN_UP:
              return 'joined Stand With Crypto'
          }
          return gracefullyError({
            msg: `Unknown opt-in type in RecentActivityRow: ${action.optInType}`,
            fallback: 'helped crypto',
          })
        }
        return (
          <>
            <MainText>
              {userDisplayName} {getTypeDisplayText()}
            </MainText>
          </>
        )
      }
      case UserActionType.CALL:
        return (
          <>
            <MainText>{userDisplayName} called their representative</MainText>
            <SubText>{formatDTSIPerson(action.person)}</SubText>
          </>
        )
      case UserActionType.DONATION:
        return (
          <>
            <MainText>{userDisplayName} donated</MainText>
            <SubText>
              <FormattedCurrency
                amount={action.amount}
                currencyCode={action.amountCurrencyCode}
                locale={locale}
              />{' '}
              to {formatDonationOrganization(action.recipient)}
            </SubText>
          </>
        )
      case UserActionType.EMAIL:
        return (
          <>
            <MainText>
              {userDisplayName} emailed their representative
              {action.userActionEmailRecipients.length > 1 ? 's' : ''}
            </MainText>
            <SubText>
              {action.userActionEmailRecipients.map(x => formatDTSIPerson(x.person)).join(', ')}
            </SubText>
          </>
        )
      case UserActionType.NFT_MINT: {
        return <MainText>{userDisplayName} donated by minting an NFT</MainText>
      }
      case UserActionType.TWEET: {
        return <MainText>{userDisplayName} tweeted in support of crypto</MainText>
      }
    }
    return gracefullyError({
      // @ts-ignore
      msg: `Unknown action type in RecentActivityRow for action ${action.id}: ${action.actionType}`,
      fallback: 'helped crypto',
    })
  }
  return (
    <RecentActivityRowBase action={action} locale={locale}>
      {getChild()}
    </RecentActivityRowBase>
  )
}
