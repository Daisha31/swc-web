import { getAuthenticatedData } from '@/app/[locale]/profile/getAuthenticatedData'
import { UpdateUserProfileFormDialog } from '@/components/app/updateUserProfileForm/dialog'
import { hasAllFormFieldsOnUserForUpdateUserProfileForm } from '@/components/app/updateUserProfileForm/hasAllFormFieldsOnUser'
import { UserActionRowCTA } from '@/components/app/userActionRowCTA'
import { USER_ACTION_ROW_CTA_INFO } from '@/components/app/userActionRowCTA/userActionRowCTAConstants'
import { SensitiveDataUserAvatar } from '@/components/app/userAvatar'
import { Button } from '@/components/ui/button'
import { FormattedCurrency } from '@/components/ui/formattedCurrency'
import { FormattedDatetime } from '@/components/ui/formattedDatetime'
import { FormattedNumber } from '@/components/ui/formattedNumber'
import { PageSubTitle } from '@/components/ui/pageSubTitle'
import { PageTitle } from '@/components/ui/pageTitleText'
import { Progress } from '@/components/ui/progress'
import { PageProps } from '@/types'
import { generateMetadataDetails } from '@/utils/server/metadataUtils'
import { SupportedFiatCurrencyCodes } from '@/utils/shared/currency'
import { getIntlUrls } from '@/utils/shared/urls'
import { getSensitiveDataUserDisplayName } from '@/utils/web/userUtils'
import { UserActionType } from '@prisma/client'
import _ from 'lodash'
import { Metadata } from 'next'
export const dynamic = 'force-dynamic'

type Props = PageProps

const title = 'Your Stand With Crypto profile'
const description = `See what actions you can take to help promote innovation.`
export async function generateMetadata(_props: Props): Promise<Metadata> {
  return generateMetadataDetails({
    title,
    description,
  })
}

export default async function Profile({ params }: Props) {
  const { locale } = params
  const urls = getIntlUrls(locale)
  const user = await getAuthenticatedData()
  if (!user) {
    // TODO UX
    return <div>Not logged in</div>
  }
  const { userActions } = user
  const userActionsByType: Partial<Record<UserActionType, typeof userActions>> = _.groupBy(
    userActions,
    x => x.actionType,
  )
  return (
    <div className="container">
      <div className="mb-6 flex items-center justify-between md:mx-4">
        <div className="flex items-center gap-2">
          <SensitiveDataUserAvatar size={60} user={user} />
          <div>
            <div className="text-lg font-bold">{getSensitiveDataUserDisplayName(user)}</div>
            <div className="text-sm text-gray-500">
              Joined{' '}
              <FormattedDatetime date={user.datetimeCreated} dateStyle="medium" locale={locale} />
            </div>
          </div>
        </div>
        <div>
          <UpdateUserProfileFormDialog user={user} locale={locale}>
            {hasAllFormFieldsOnUserForUpdateUserProfileForm(user) ? (
              <Button variant="secondary">Edit your profile</Button>
            ) : (
              <Button>Finish your profile</Button>
            )}
          </UpdateUserProfileFormDialog>
        </div>
      </div>
      <div className="mb-14 grid grid-cols-4 rounded-lg bg-blue-50 p-3 text-center sm:p-6">
        {[
          {
            label: 'Actions',
            value: <FormattedNumber amount={userActions.length} locale={locale} />,
          },
          {
            label: 'Donated',
            value: (
              <FormattedCurrency
                locale={locale}
                currencyCode={SupportedFiatCurrencyCodes.USD}
                amount={_.sumBy(userActions, x => {
                  if (x.actionType === UserActionType.DONATION) {
                    return x.amountUsd
                  }
                  return 0
                })}
              />
            ),
          },
          {
            label: 'Leaderboard',
            value: <>TODO</>,
          },
          {
            label: 'NFTs',
            value: (
              <FormattedNumber
                amount={userActions.filter(action => action.nftMint).length}
                locale={locale}
              />
            ),
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-xs text-gray-700 sm:text-sm md:text-base">{label}</div>
            <div className="text-sm font-bold sm:text-base md:text-xl">{value}</div>
          </div>
        ))}
      </div>
      <PageTitle className="mb-4">Your advocacy progress</PageTitle>
      <PageSubTitle className="mb-5">
        You've completed {Object.keys(userActionsByType).length} out of{' '}
        {Object.values(UserActionType).length} actions. Keep going!
      </PageSubTitle>
      <div className="mx-auto mb-5 max-w-xl">
        <Progress
          value={
            (Object.keys(userActionsByType).length / Object.values(UserActionType).length) * 100
          }
        />
      </div>
      <div className="mb-14 space-y-4">
        {USER_ACTION_ROW_CTA_INFO.map(({ actionType, ...rest }) => (
          <UserActionRowCTA
            key={actionType}
            state={userActionsByType[actionType]?.length ? 'complete' : 'incomplete'}
            {...{ actionType, ...rest }}
          />
        ))}
      </div>
      <PageTitle className="mb-4">Your NFTs</PageTitle>
      <PageSubTitle className="mb-5">
        You will receive free NFTs for completing advocacy-related actions.
      </PageSubTitle>
      <p className="text-center">TODO</p>
    </div>
  )
}
