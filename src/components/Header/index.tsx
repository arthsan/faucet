import { Box, Text, Button, Link } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import * as S from './styles'
import Web3 from 'web3'
import { provider } from 'web3-core'
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from '../../utils/loadContract'

type Web3ApiProps = {
  provider: provider
  web3: Web3 | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contract: any
  isProviderLoaded: boolean
}

const Header = () => {
  const [balance, setBalance] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [updateBalance, setUpdateBalance] = useState(false)
  const [userBalance, setUserBalance] = useState<string | null>(null)
  const [web3Api, setWeb3Api] = useState<Web3ApiProps>({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false
  })

  const canConnectToContract = account && web3Api.contract
  const onBalanceChange = useCallback(
    () => setUpdateBalance(!updateBalance),
    [updateBalance]
  )

  const setAccountListener = (provider: provider) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider?.on('accountsChanged', (_) => window.location.reload())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider?.on('chainChanged', (_) => window.location.reload())

    /**
     * ! provider?.on('accountsChanged', (accounts: string[]) =>
     * !   setAccount(accounts[0])
     * ! )
      
    * ? provider?._jsonRpcConnection.events.on('notification', (payload) => {
    * ?   const { method } = payload
  
    * ?        if (method === 'metamas_unlockStateChanged') {
    * ?       setAccount(null)
    * ?  }
    * ? })
    */
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider: provider = await detectEthereumProvider()

      if (provider) {
        const contract = await loadContract('Faucet', provider)
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setWeb3Api((api) => ({ ...api, isProviderLoaded: true }))
        console.error('Please, install metamask')
      }
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const { contract, web3 } = web3Api

    const getAccount = async () => {
      const accounts = await web3Api.web3?.eth.getAccounts()
      accounts && setAccount(accounts[0])
    }
    const getUserBalance = async () => {
      const yourBalance: string = await web3?.eth.getBalance(account)
      const convertedBalance: string = web3?.utils.fromWei(yourBalance, 'ether')
      yourBalance && setUserBalance(convertedBalance)
    }

    const loadBalance = async () => {
      const balance: string = await web3?.eth.getBalance(contract?.address)
      const convertedBalance: string = web3?.utils.fromWei(balance, 'ether')
      setBalance(convertedBalance)
    }

    web3 && getAccount()
    account && getUserBalance()
    contract && loadBalance()
  }, [web3Api, onBalanceChange, userBalance, account])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3?.utils.toWei('1', 'ether')
    })
    onBalanceChange()
  }, [web3Api, account, onBalanceChange])

  const withdrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3?.utils.toWei('0.1', 'ether')
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    onBalanceChange()
  }, [onBalanceChange, account, web3Api])

  return (
    <S.Wrapper>
      <Box display="flex">
        <Text align="center" m="4" fontSize="2xl" fontWeight="bold">
          Account:
        </Text>
        {!web3Api.provider ? (
          <Button
            isLoading={!web3Api.isProviderLoaded}
            loadingText="Connecting"
            p="4"
            colorScheme="yellow"
            borderRadius="lg"
            alignItems="center"
            h="16"
          >
            <Link href="https://docs.metamask.io" isExternal>
              <Text align="center">Please isntall metamask!</Text>
            </Link>
          </Button>
        ) : (
          <Text align="center" m="4" fontSize="2xl">
            {account ? account : 'not conected'}
          </Text>
        )}
      </Box>
      <Text align="center" m="4" fontSize="2xl">
        User Balance: {userBalance ? userBalance : 'not conected'} ETH
      </Text>
      <Box p="6" display="flex">
        <Text m="4" align="center" fontSize="5xl">
          Current Balance:
        </Text>
        <Text m="4" align="center" fontSize="5xl" fontWeight="bold">
          {balance ? balance : 'no parameters'}
        </Text>
        <Text p="4" align="center" fontSize="5xl">
          ETH
        </Text>
      </Box>

      <Box>
        {account ? (
          <></>
        ) : (
          <Button
            onClick={() =>
              web3Api.provider?.request({ method: 'eth_requestAccounts' })
            }
            p="4"
            m="2"
            colorScheme="teal"
          >
            Connect Metamask
          </Button>
        )}
        {!canConnectToContract && <Text as="i">Connect to Ganache</Text>}
        <Box display="flex">
          <Button
            disabled={!canConnectToContract}
            p="4"
            m="2"
            colorScheme="blue"
            onClick={() => addFunds()}
          >
            Donate 1 eth
          </Button>
          <Button
            disabled={!canConnectToContract}
            p="4"
            m="2"
            colorScheme="blue"
            onClick={() => withdrawFunds()}
          >
            Withdraw 0.1 eth
          </Button>
        </Box>
      </Box>
    </S.Wrapper>
  )
}

export default Header
