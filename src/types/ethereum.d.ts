/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ethereum: Ethereumish
    web3: Ethereumish
  }
}

import {
  ProviderMessage,
  ProviderRpcError,
  ProviderConnectInfo,
  RequestArguments
} from 'hardhat/types'

export interface EthereumEvent {
  connect: ProviderConnectInfo
  disconnect: ProviderRpcError
  accountsChanged: Array<string>
  chainChanged: string
  message: ProviderMessage
}

type EventKeys = keyof EthereumEvent
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void

export interface Ethereumish {
  autoRefreshOnNetworkChange: boolean
  chainId: string
  isMetaMask?: boolean
  isStatus?: boolean
  networkVersion: string
  selectedAddress: any
  currentProvider: ExternalProvider

  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
  enable(): Promise<any>
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>
  /**
   * @deprecated
   */
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  sendAsync: (request: RequestArguments) => Promise<unknown>
}

export type ExternalProvider = {
  isMetaMask?: boolean
  isStatus?: boolean
  host?: string
  path?: string
  sendAsync?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>
}
