import { Trans } from '@lingui/macro'
import { Col, Divider, Modal, Row, Image } from 'antd'
import FormattedAddress from 'components/shared/FormattedAddress'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useLockTx } from 'hooks/veNft/transactor/LockTx'

import { useContext } from 'react'
import { formattedNum, parseWad } from 'utils/formatNumber'

import { detailedTimeString } from 'utils/formatTime'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbol: string
  tokensStaked: number
  votingPower: number
  lockDuration: number
  beneficiary: string
  maxLockDuration: number
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMetadata: any
  onCancel: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbol,
  tokensStaked,
  votingPower,
  lockDuration,
  beneficiary,
  maxLockDuration,
  tokenMetadata,
  onCancel,
}: ConfirmStakeModalProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const recipient = beneficiary !== '' ? beneficiary : userAddress!

  const tokensStakedInWad = parseWad(tokensStaked)

  const formattedLockDuration = detailedTimeString({
    timeSeconds: lockDuration,
    fullWords: true,
  })
  const formattedMaxLockDuration = detailedTimeString({
    timeSeconds: maxLockDuration,
    fullWords: true,
  })

  const lockTx = useLockTx()

  async function lock() {
    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txSuccess = await lockTx({
      account: userAddress!,
      value: tokensStakedInWad,
      lockDuration: lockDuration,
      beneficiary: recipient,
      useJbToken: true,
      allowPublicExtension: false,
    })

    if (!txSuccess) {
      return
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={lock}
      okText={`Lock $${tokenSymbol}`}
    >
      <h2>Confirm Stake</h2>
      <div style={{ color: colors.text.secondary, textAlign: 'center' }}>
        <p>
          {votingPower} = {tokensStaked} ${tokenSymbol} * ({' '}
          {formattedLockDuration} / {formattedMaxLockDuration} )
        </p>
      </div>
      <h4>
        <Trans>
          You are agreeing to IRREVOCABLY lock your tokens for{' '}
          {formattedLockDuration} in exchange for {votingPower} $ve{tokenSymbol}
        </Trans>
      </h4>
      <Divider />
      <h4>$ve{tokenSymbol} NFT summary:</h4>
      <Row>
        <Col span={14}>
          <Row align="top" gutter={0}>
            <Col span={12}>
              <p>Staked ${tokenSymbol}:</p>
              <p>Lock Duration:</p>
              <p>$ve{tokenSymbol} Received:</p>
              <p>Beneficiary:</p>
            </Col>
            <Col span={12}>
              <p>{formattedNum(tokensStaked)}</p>
              <p>{formattedLockDuration}</p>
              <p>{formattedNum(votingPower)}</p>
              <FormattedAddress address={recipient} />
            </Col>
          </Row>
        </Col>
        <Col span={4} />
        <Col span={6}>
          <Image
            src={tokenMetadata && tokenMetadata.thumbnailUri}
            preview={false}
          ></Image>
        </Col>
      </Row>
    </Modal>
  )
}
