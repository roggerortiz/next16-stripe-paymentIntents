import CheckoutForm from '../components/checkout';
import { calculateOrder } from '../lib/order';

// Calculate the current order total for each checkout.
export const dynamic = 'force-dynamic';

export default async function IndexPage() {
  const { amount, currency } = await calculateOrder();

  return (
    <div id="checkout">
      <CheckoutForm amount={amount} currency={currency} />
    </div>
  );
}