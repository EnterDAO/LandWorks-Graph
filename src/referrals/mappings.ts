import { common } from '../common';
import {
  ClaimReferrerFee
} from '../../generated/ReferralFacet/IReferralFacet';
import { constants } from '../constants';


export function handleClaimReferrerFee(event: ClaimReferrerFee): void {
  const user = event.params._claimer.toHexString();
  const paymentToken = event.params._token.toHexString();

  const referralReward = common.createUserReferralRewardIfNotExists(user, paymentToken);
  referralReward.amount = constants.BIGINT_ZERO;
  referralReward.save();
}
