import { Trans } from '@lingui/macro'
import { Button, Form, Input, Modal, Space } from 'antd'
import { MinimalCollapse } from 'components/shared/MinimalCollapse'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useSetProjectTerminalsTx } from 'hooks/v2/transactor/SetProjectTerminalsTx'
import { useSetV1ProjectIdTx } from 'hooks/v2/transactor/SetV1ProjectIdTx'
import { useCallback, useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function V1V2MigrationSection() {
  const [migrationModalVisible, setMigrationModalVisible] =
    useState<boolean>(false)

  const [form] = Form.useForm<{ v1ProjectId: number }>()

  const { contracts } = useContext(V2UserContext)
  const { terminals } = useContext(V2ProjectContext)

  const setProjecTerminalsTx = useSetProjectTerminalsTx()
  const setV1ProjectIdTx = useSetV1ProjectIdTx()

  const onAddTerminal = useCallback(async () => {
    if (!contracts?.JBV1V2MigrationTerminal.address) return

    const newTerminals = [
      ...(terminals || []),
      contracts.JBV1V2MigrationTerminal.address,
    ]
    try {
      const result = await setProjecTerminalsTx({ terminals: newTerminals })
      if (!result) throw new Error()
    } catch (e) {
      emitErrorNotification('Error adding migration terminal.')
      throw e
    }
  }, [terminals, setProjecTerminalsTx, contracts])

  const onSetV1ProjectId = useCallback(async () => {
    try {
      const result = await setV1ProjectIdTx({
        v1ProjectId: form.getFieldValue('v1ProjectId'),
      })
      if (!result) throw new Error()
    } catch (e) {
      emitErrorNotification('Error adding migration terminal.')
      throw e
    }
  }, [setV1ProjectIdTx, form])

  return (
    <section>
      <h3>
        <Trans>Migrate V1 project to V2</Trans>
      </h3>
      <p>
        <Trans>
          Set up your Juicebox V2 project for migration from your Juicebox V1
          project.
        </Trans>
      </p>

      <MinimalCollapse
        header={<Trans>Do I need to migrate my V1 project?</Trans>}
        style={{ marginBottom: '1rem' }}
      >
        <Trans>
          If you have Juicebox project on Juicebox V1 and V2, we recommend you
          migrate to V2.
        </Trans>
      </MinimalCollapse>

      <Button
        onClick={() => setMigrationModalVisible(true)}
        type="primary"
        size="small"
      >
        <Trans>Set up migration</Trans>
      </Button>

      <Modal
        title={<Trans>Set up V1 Migration</Trans>}
        visible={migrationModalVisible}
        onCancel={() => setMigrationModalVisible(false)}
      >
        <p style={{ marginBottom: '2rem' }}>
          <Trans>
            Set up your Juicebox V2 project for migration from your Juicebox V1
            project.
          </Trans>
        </p>

        <Space direction="vertical" size="large">
          <section style={{ marginBottom: '2rem' }}>
            <h3>Step 1. Add migration payment terminal</h3>
            <p>Add the V1-V2 Migration Payment Terminal to your project.</p>

            <p>
              <MinimalCollapse
                header={
                  <Trans>What is the V1-V2 Migration Payment Terminal?</Trans>
                }
              >
                Token holders of your V1 project tokens will swap their V1
                tokens for V2 tokens at a 1-to-1 exchange rate.
              </MinimalCollapse>
            </p>

            <Button type="primary" size="small" onClick={onAddTerminal}>
              Add Terminal
            </Button>
          </section>

          <section>
            <h3>Step 2. Link your Juicebox V1 project</h3>
            <p>
              Configure which Juicebox V1 project you'd like to accept tokens
              for. Token holders of this V1 project will be able to swap their
              V1 tokens for V2 tokens.
            </p>

            <Form layout="vertical" form={form} onFinish={onSetV1ProjectId}>
              <Form.Item
                name="v1ProjectId"
                label={<Trans>Juicebox V1 project ID</Trans>}
                required
              >
                <Input placeholder="1" />
              </Form.Item>

              <Button type="primary" size="small">
                Link Juicebox V1 project
              </Button>
            </Form>
          </section>
        </Space>
      </Modal>
    </section>
  )
}
