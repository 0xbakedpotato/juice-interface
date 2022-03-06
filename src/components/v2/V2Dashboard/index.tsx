import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useParams } from 'react-router-dom'
import Loading from 'components/shared/Loading'
import { BigNumber } from '@ethersproject/bignumber'
import useProjectMetadataContent from 'hooks/v2/contractReader/ProjectMetadataContent'
import ScrollToTopButton from 'components/shared/ScrollToTopButton'

import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'

import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import { useETHPaymentTerminalBalance } from 'hooks/v2/contractReader/ETHPaymentTerminalBalance'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useOwnerOfProject from 'hooks/v2/contractReader/OwnerOfProject'

import { layouts } from 'constants/styles/layouts'

import V2Project from '../V2Project'
import Dashboard404 from './Dashboard404'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVE_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

export default function V2Dashboard() {
  const { projectId: projectIdParameter }: { projectId?: string } = useParams()
  const projectId = BigNumber.from(projectIdParameter)

  const { data: owner, loading: ownerOfProjectLoading } =
    useOwnerOfProject(projectId)

  const { data: metadataCID, loading: metadataURILoading } =
    useProjectMetadataContent(projectId)

  const {
    data: projectMetadata,
    error: metadataError,
    isLoading: metadataLoading,
  } = useProjectMetadata(metadataCID)

  const { data: fundingCycle, loading: fundingCycleLoading } =
    useProjectCurrentFundingCycle({
      projectId,
    })

  const { data: payoutSplits, loading: payoutSplitsLoading } = useProjectSplits(
    {
      projectId,
      splitGroup: ETH_PAYOUT_SPLIT_GROUP,
      domain: fundingCycle?.configuration?.toString(),
    },
  )

  const { data: terminals, loading: terminalsLoading } = useProjectTerminals({
    projectId,
  })

  const { data: reserveTokenSplits, loading: reserveTokenSplitsLoading } =
    useProjectSplits({
      projectId,
      splitGroup: RESERVE_TOKEN_SPLIT_GROUP,
      domain: fundingCycle?.configuration?.toString(),
    })

  const { data: ETHBalance, loading: ETHBalanceLoading } =
    useETHPaymentTerminalBalance({
      projectId,
    })

  const { data: tokenAddress, loading: tokenAddressLoading } = useProjectToken({
    projectId,
  })

  if (metadataLoading || metadataURILoading) return <Loading />

  if (projectId?.eq(0) || metadataError) {
    return <Dashboard404 projectId={projectId} />
  }

  const project = {
    projectId,
    owner,
    projectMetadata,
    fundingCycle,
    payoutSplits,
    reserveTokenSplits,
    tokenAddress,
    terminals,
    ETHBalance,
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <div style={layouts.maxWidth}>
        <V2Project />

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <ScrollToTopButton />
        </div>
      </div>
    </V2ProjectContext.Provider>
  )
}
