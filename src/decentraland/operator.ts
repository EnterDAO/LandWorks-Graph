import {
  UpdateAdministrativeOperator,
  UpdateAdministrativeState,
  UpdateOperator,
  UpdateState
} from '../../generated/DecentralandFacet/IDecentralandFacet';
import { common } from '../common';
import { Rent } from '../../generated/schema';

export function handleUpdateOperator(event: UpdateOperator): void {
  const assetId = event.params._assetId.toString();
  const rentId = `${assetId}-${event.params._rentId.toString()}`;

  const rent: Rent = common.createRentIfNotExists(rentId);
  rent.operator = event.params._operator;

  rent.save();
}

export function handleUpdateState(event: UpdateState): void {
  const assetId = event.params._assetId.toString();

  common.updateAssetOperator(assetId, event.params._operator);
}

export function handleUpdateAdministrativeState(event: UpdateAdministrativeState): void {
  const assetId = event.params._assetId.toString();

  common.updateAssetOperator(assetId, event.params._operator);
}

export function handleUpdateAdministrativeOperator(event: UpdateAdministrativeOperator): void {
  common.updateAdministrativeOperator(event.params._administrativeOperator);
}
