import React from "react";
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe public key
const stripePromise = loadStripe("your-publishable-key-here");

const PaymentForm = ({ setalternativeCurrency }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const result = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      console.log("Success:", result.paymentMethod.id);
      // send result.paymentMethod.id to your backend
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4">Update Payment Method</h2>

        <label>Cardholder Name</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="John Doe"
          required
        />

        <label>Card Info</label>
        <div className="form-control mb-3">
          <CardElement />
        </div>

        <label>
          <input type="checkbox" name="saveCard" /> Save this card for future
          payments
        </label>

        <br />
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary mt-3 me-2"
            disabled={!stripe}
          >
            Save Payment Method
          </button>
        </div>
        {/* <button onClick={() => {setalternativeCurrency(false)}} className="btn btn-success mt-3">
        Pay With Paystack
      </button> */}
      </form>
    </>
  );
};

const StripePayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripePayment;
