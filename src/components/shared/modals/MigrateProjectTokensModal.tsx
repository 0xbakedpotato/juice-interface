import { Trans } from '@lingui/macro'
import { Form, Input, Modal, ModalProps, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { MinimalCollapse } from '../MinimalCollapse'

export function MigrateProjectTokensModal({
  v1TokenSymbol,
  v1TokenBalance,
  v2ProjectName,
  v1ProjectHandle,
  ...props
}: {
  v1TokenSymbol?: string
  v1TokenBalance: number
  v2ProjectName: string
  v1ProjectHandle: string
} & ModalProps) {
  const [tokenAmount, setTokenAmount] = useState<number>(0)
  const tokenSymbolFormatted = tokenSymbolText({
    tokenSymbol: v1TokenSymbol,
  })

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const handleModalOk = () => {
    // swap
  }

  // const remainingV1Balance = v1TokenBalance - tokenAmount

  return (
    <Modal
      okText={
        <span>
          <Trans>Migrate V1 {tokenSymbolFormatted} to V2</Trans>
        </span>
      }
      onOk={handleModalOk}
      title={<Trans>Migrate V1 {tokenSymbolFormatted} to V2</Trans>}
      {...props}
    >
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <div style={{ backgroundColor: colors.background.l2, padding: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <Trans>
              <span style={{ fontWeight: 600 }}>{v2ProjectName}</span> has
              tokens on <Link to={`/p/${v1ProjectHandle}`}>Juicebox V1</Link>.
              You can migrate your{' '}
              <span style={{ fontWeight: 600 }}>{v2ProjectName}</span> V1 tokens
              to V2.
            </Trans>
          </p>

          <MinimalCollapse header={<Trans>Do I need to migrate?</Trans>}>
            asd
          </MinimalCollapse>
        </div>

        <Form layout="vertical">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <span>
              <Trans>Your V1 {tokenSymbolFormatted} balance:</Trans>
            </span>
            <span>
              {v1TokenBalance} {tokenSymbolFormatted}
            </span>
          </div>

          <Form.Item label={<Trans>Tokens to migrate</Trans>}>
            <Input
              onChange={e => {
                setTokenAmount(parseInt(e.target.value))
              }}
              value={tokenAmount}
              type="number"
              suffix={`V1 ${tokenSymbolFormatted}`}
            ></Input>
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
