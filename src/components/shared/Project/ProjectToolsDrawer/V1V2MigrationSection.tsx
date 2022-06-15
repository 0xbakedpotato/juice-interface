import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { MinimalCollapse } from 'components/shared/MinimalCollapse'
import { useState } from 'react'

export function V1V2MigrationSection() {
  const [migrationModalVisible, setMigrationModalVisible] = useState<boolean>()

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
      <p>
        <MinimalCollapse
          header={<Trans>Do I need to migrate my V1 project?</Trans>}
        >
          <Trans>
            If you have Juicebox project on Juicebox V1 and V2, we recommend you
            migrate to V2.
          </Trans>
        </MinimalCollapse>
      </p>
      <Button
        onClick={() => setMigrationModalVisible(true)}
        type="primary"
        size="small"
      >
        <Trans>Set up migration</Trans>
      </Button>
      <Modal
        visible={migrationModalVisible}
        onCancel={() => setMigrationModalVisible(false)}
      >
        hey
      </Modal>
    </section>
  )
}
