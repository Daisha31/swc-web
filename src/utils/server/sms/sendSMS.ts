import { z } from 'zod'

import { requiredEnv } from '@/utils/shared/requiredEnv'
import { apiUrls, fullUrl } from '@/utils/shared/urls'

import { messagingClient } from './messagingClient'
import { SendSMSError } from './SendSMSError'

const TWILIO_PHONE_NUMBER = requiredEnv(process.env.TWILIO_PHONE_NUMBER, 'TWILIO_PHONE_NUMBER')

const zodSendSMSSchema = z.object({
  to: z.string(),
  body: z.string(),
})

export type SendSMSPayload = z.infer<typeof zodSendSMSSchema>

export const sendSMS = async (payload: SendSMSPayload) => {
  const validatedInput = zodSendSMSSchema.safeParse(payload)

  if (!validatedInput.success) {
    throw new Error('Invalid sendSMS payload')
  }

  const { body, to } = validatedInput.data

  try {
    const statusCallback = fullUrl(apiUrls.smsStatusCallback())

    const message = await messagingClient.messages.create({
      from: TWILIO_PHONE_NUMBER,
      body,
      statusCallback,
      to,
    })

    return message
  } catch (error) {
    throw new SendSMSError(error, to)
  }
}
