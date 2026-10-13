"use client";

import { useState } from "react";
import { createPaymentIntent } from "../app/actions";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function PaymentForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();


  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || isLoading) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    try {
      // Validate the form and collect wallet details before creating the PaymentIntent.
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setMessage(submitError.message);
        return;
      }

      const { paymentMethod: paymentMethodId, error: createMethodError } = await stripe.createPaymentMethod({
        elements,
        params: {
          billing_details: {
            address: {
              country: 'GB', // Obligatorio ya que lo ocultaste con 'never'
              postal_code: 'SW1A 2AA', // Añade otros si también los ocultaste
            },
          }
        }
      })
      if (createMethodError) {
        setMessage(createMethodError.message);
        return;
      }

      const { clientSecret, cardDetails, error: createIntentError } = await createPaymentIntent(amount, paymentMethodId.id);
      if (createIntentError) {
        setMessage(createIntentError);
        return;
      }

      console.log({ clientSecret, cardDetails })

      // const { error, paymentIntent } = await stripe.confirmPayment({
      //   elements,
      //   clientSecret,
      //   confirmParams: {
      //     // Make sure to change this to your payment completion page
      //     return_url: "http://localhost:3000/success",
      //     payment_method_data: {
      //       billing_details: {
      //         address: {
      //           country: 'GB', // Obligatorio ya que lo ocultaste con 'never'
      //           postal_code: 'SW1A 2AA', // Añade otros si también los ocultaste
      //         },
      //       },
      //     },
      //   },
      //   redirect: 'if_required',
      // });

      // if (paymentIntent && paymentIntent.status === 'succeeded') {
      //   // Extracción de metadatos de la tarjeta
      //   // Nota: La estructura exacta depende de la expansión de payment_method o charges
      //   const paymentMethod = paymentIntent.payment_method;
      //   console.log({ paymentMethod })
      //   const cardDetails = await getPaymentMethod(paymentMethod);
      //   console.log({ cardDetails })

      //   // Si el payment_method se expandió o se consulta al backend:
      //   // Los datos como last4, brand y exp_year residen en el objeto payment_method o charge.
      // }


      // Successful payments redirect to your return_url. Otherwise, show the error.
      // if (error) {
      //   setMessage(error.message || "An unexpected error occurred.");
      // }
    } catch (error) {
      console.log({ error })
      setMessage("Unable to process your payment. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: 'auto',
    fields: {
      billingDetails: {
        name: 'always',
        address: { country: 'never', postalCode: 'never' }
      }
    }
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

export default function CheckoutForm({ amount, currency }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
        },
        mode: 'payment',
        amount,
        currency,
        locale: 'en-GB',
        paymentMethodCreation: 'manual'
      }}
    >
      <PaymentForm amount={amount} />
    </Elements>
  )
}