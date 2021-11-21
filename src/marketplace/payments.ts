import { SetFee, SetTokenPayment } from '../../generated/FeeFacet/IFeeFacet';
import { PaymentToken } from '../../generated/schema';
import { constants } from '../constants';
import { IERC20Metadata } from '../../generated/FeeFacet/IERC20Metadata';
import { Address } from '@graphprotocol/graph-ts';

export function handleSetFee(event: SetFee): void {
  const id = event.params._token;
  let paymentToken = PaymentToken.load(id.toString());

  if (paymentToken == null) {
    paymentToken = new PaymentToken(id.toString());
    paymentToken = setERC20Data(id, paymentToken);
  }
  paymentToken.feePercentage = event.params._fee;

  paymentToken.save();
}

export function handleSetTokenPayment(event: SetTokenPayment): void {
  const id = event.params._token;
  if (event.params._status) {
    let paymentToken = new PaymentToken(id.toString());
    paymentToken = setERC20Data(id, paymentToken);
    paymentToken.save();
  } else {
    // TODO: when you want to remove it
    // should we add an `enabled` column, storing this?
  }
}

function setERC20Data(id: Address, paymentToken: PaymentToken): PaymentToken {
  if (id.equals(constants.ZERO_ADDRESS)) {
    paymentToken.name = 'Ether';
    paymentToken.symbol = 'ETH';
    paymentToken.decimals = 18;
  } else {
    const token = IERC20Metadata.bind(id);
    paymentToken.name = token.name();
    paymentToken.symbol = token.symbol();
    paymentToken.decimals = token.decimals();
  }

  return paymentToken;
}
