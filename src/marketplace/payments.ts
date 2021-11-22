import { ClaimRentFee, SetFee, SetTokenPayment } from '../../generated/FeeFacet/IFeeFacet';
import { common } from '../common';

export function handleSetFee(event: SetFee): void {
  const id = event.params._token;

  const paymentToken = common.createTokenPaymentIfNotExists(id);
  paymentToken.feePercentage = event.params._fee;
  paymentToken.save();
}

export function handleSetTokenPayment(event: SetTokenPayment): void {
  const id = event.params._token;

  const paymentToken = common.createTokenPaymentIfNotExists(id);
  if (event.params._status) {
    paymentToken.isRemoved = false;
  } else {

  }
  paymentToken.isRemoved = event.params._status;
  paymentToken.save();
}

export function handleClaimRentFee(event: ClaimRentFee): void {
  const assetId = event.params._assetId.toString();
  const asset = common.createAssetIfNotExists(assetId);
  asset.unclaimedRentFee = asset.unclaimedRentFee.minus(event.params._amount);

  asset.save();
}
