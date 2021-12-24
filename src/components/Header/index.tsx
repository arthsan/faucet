import { Box, Text, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import * as S from './styles'
import Web3 from 'web3'
import { provider } from 'web3-core'
import detectEthereumProvider from '@metamask/detect-provider'

type Web3ApiProps = {
  provider: provider
  web3: Web3 | null
}

const Header = () => {
  const [web3Api, setWeb3Api] = useState<Web3ApiProps>({
    provider: null,
    web3: null
  })
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider: provider = await detectEthereumProvider()

      if (provider) {
        provider.request({ method: 'eth_requestAccounts' })
        setWeb3Api({
          web3: new Web3(provider),
          provider
        })
      } else {
        console.error('Please, install metamask')
      }
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3?.eth.getAccounts()
      accounts && setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  return (
    <S.Wrapper>
      <Box display="flex">
        <Text align="center" m="4" fontSize="2xl" fontWeight="bold">
          Account:
        </Text>
        <Text align="center" m="4" fontSize="xl">
          {account ? account : 'not conected'}
        </Text>
      </Box>
      <Box p="6" display="flex">
        <Text m="4" align="center" fontSize="5xl">
          Current Balance:
        </Text>
        <Text m="4" align="center" fontSize="2xl" fontWeight="bold">
          10
        </Text>
        <Text p="4" align="center" fontSize="2xl">
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
        <Button p="4" m="2" colorScheme="blue">
          Donate
        </Button>
        <Button p="4" m="2" colorScheme="blue">
          Withdraw
        </Button>
      </Box>
    </S.Wrapper>
  )
}

export default Header
