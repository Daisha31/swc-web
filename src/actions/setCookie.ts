'use server'
import 'server-only'
import { cookies } from 'next/headers'

export async function setCookie(...args: Parameters<ReturnType<typeof cookies>['set']>) {
  cookies().set(...args)
}
