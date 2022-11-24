import { Claim, IDistributor } from '../../generated/Distributor/IDistributor';
import { common } from '../common';

export function handleClaimDistribution(event: Claim): void {
  const receiver = event.params.account.toHexString();
  const txHash = event.transaction.hash.toHexString();
  const distributor = IDistributor.bind(event.address);
  const id = `${event.address.toHexString()}-${txHash}-${event.transactionLogIndex.toString()}`;
  const paymentToken = distributor.token();

  common.createUserIfNotExists(receiver);

  const claimHistory = common.createClaimHistoryIfNotExists(id);
  claimHistory.receiver = receiver;
  claimHistory.txHash = txHash;
  claimHistory.timestamp = event.block.timestamp;
  claimHistory.amount = event.params.amount;
  claimHistory.paymentToken = paymentToken.toHexString();
  claimHistory.metaverse = '1'; // Currently applies for Decentraland
  claimHistory.save();
}
