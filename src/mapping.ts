import {
  PlanckCats as PlanckCatsContract,
  Transfer as TransferEvent
} from "../generated/PlanckCats/PlanckCats";

import {
  Approval,
  ApprovalForAll,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.save()
}
