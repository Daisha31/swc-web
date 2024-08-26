import { NFTSlug } from '@/utils/shared/nft'
import { requiredEnv } from '@/utils/shared/requiredEnv'

const SWC_SHIELD_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.SWC_SHIELD_NFT_CONTRACT_ADDRESS,
  'SWC_SHIELD_NFT_CONTRACT_ADDRESS',
)

const CALL_REPRESENTATIVE_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.CALL_REPRESENTATIVE_NFT_CONTRACT_ADDRESS,
  'CALL_REPRESENTATIVE_NFT_CONTRACT_ADDRESS',
)

export const I_AM_A_VOTER_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.I_AM_A_VOTER_NFT_CONTRACT_ADDRESS,
  'I_AM_A_VOTER_NFT_CONTRACT_ADDRESS',
)

const STAND_WITH_CRYPTO_LEGACY_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.STAND_WITH_CRYPTO_LEGACY_NFT_CONTRACT_ADDRESS,
  'STAND_WITH_CRYPTO_LEGACY_NFT_CONTRACT_ADDRESS',
)

const STAND_WITH_CRYPTO_SUPPORTER_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.STAND_WITH_CRYPTO_SUPPORTER_NFT_CONTRACT_ADDRESS,
  'STAND_WITH_CRYPTO_SUPPORTER_NFT_CONTRACT_ADDRESS',
)

const LA_CRYPTO_EVENT_2024_03_04_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.LA_CRYPTO_EVENT_2024_03_04_NFT_CONTRACT_ADDRESS,
  'LA_CRYPTO_EVENT_2024_03_04_NFT_CONTRACT_ADDRESS',
)

export const LEGACY_NFT_DEPLOYER_WALLET = requiredEnv(
  process.env.LEGACY_NFT_DEPLOYER_WALLET,
  'LEGACY_NFT_DEPLOYER_WALLET',
)

const SWC_PIZZA_DAY_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.SWC_PIZZA_DAY_NFT_CONTRACT_ADDRESS,
  'SWC_PIZZA_DAY_NFT_CONTRACT_ADDRESS',
)

const SWC_VOTER_ATTESTATION_NFT_CONTRACT_ADDRESS = requiredEnv(
  process.env.SWC_VOTER_ATTESTATION_NFT_CONTRACT_ADDRESS,
  'SWC_VOTER_ATTESTATION_NFT_CONTRACT_ADDRESS',
)

export const SWC_DOT_ETH_WALLET = requiredEnv(process.env.SWC_DOT_ETH_WALLET, 'SWC_DOT_ETH_WALLET')

export const NFT_SLUG_BACKEND_METADATA: Record<
  NFTSlug,
  { contractAddress: string; associatedWallet: string }
> = {
  [NFTSlug.SWC_SHIELD]: {
    contractAddress: SWC_SHIELD_NFT_CONTRACT_ADDRESS,
    associatedWallet: LEGACY_NFT_DEPLOYER_WALLET,
  },
  [NFTSlug.CALL_REPRESENTATIVE_SEPT_11]: {
    contractAddress: CALL_REPRESENTATIVE_NFT_CONTRACT_ADDRESS,
    associatedWallet: LEGACY_NFT_DEPLOYER_WALLET,
  },
  [NFTSlug.I_AM_A_VOTER]: {
    contractAddress: I_AM_A_VOTER_NFT_CONTRACT_ADDRESS,
    associatedWallet: SWC_DOT_ETH_WALLET,
  },
  [NFTSlug.STAND_WITH_CRYPTO_LEGACY]: {
    contractAddress: STAND_WITH_CRYPTO_LEGACY_NFT_CONTRACT_ADDRESS,
    associatedWallet: SWC_DOT_ETH_WALLET,
  },
  [NFTSlug.STAND_WITH_CRYPTO_SUPPORTER]: {
    contractAddress: STAND_WITH_CRYPTO_SUPPORTER_NFT_CONTRACT_ADDRESS,
    associatedWallet: LEGACY_NFT_DEPLOYER_WALLET,
  },
  [NFTSlug.LA_CRYPTO_EVENT_2024_03_04]: {
    contractAddress: LA_CRYPTO_EVENT_2024_03_04_NFT_CONTRACT_ADDRESS,
    associatedWallet: SWC_DOT_ETH_WALLET,
  },
  [NFTSlug.PIZZA_DAY_2024_05_22]: {
    contractAddress: SWC_PIZZA_DAY_NFT_CONTRACT_ADDRESS,
    associatedWallet: SWC_DOT_ETH_WALLET,
  },
  [NFTSlug.VOTER_ATTESTATION]: {
    contractAddress: SWC_VOTER_ATTESTATION_NFT_CONTRACT_ADDRESS,
    associatedWallet: SWC_DOT_ETH_WALLET,
  },
}
