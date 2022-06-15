import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useSetV1ProjectIdTx(): TransactorInstance<{
  v1ProjectId: number
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ v1ProjectId }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBV1V2MigrationTerminal) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBV1V2MigrationTerminal,
      'setV1ProjectId',
      [projectId, v1ProjectId],
      txOpts,
    )
  }
}
