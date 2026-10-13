'use server';

import { stripe } from '../lib/stripe';
import { calculateOrder } from '../lib/order';

export async function createPaymentIntent(expectedAmount, paymentMethodId) {
  // Recalculate on the server before charging the customer.
  const order = await calculateOrder();
  if (order.amount !== expectedAmount) {
    return { error: 'The order total changed. Refresh the page and try again.' };
  }

  // Create the PaymentIntent after the customer submits the payment form.
  const { client_secret: clientSecret, payment_method: { card } } = await stripe.paymentIntents.create({
    confirm: true,
    amount: order.amount,
    currency: order.currency,
    payment_method: paymentMethodId,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never'
    },
    expand: ['payment_method']
  });

  const cardDetails = {
    brand: card.brand,
    last4: card.last4,
    expMonth: card.exp_month,
    expYear: card.exp_year,
  }

  return { clientSecret, cardDetails };
}