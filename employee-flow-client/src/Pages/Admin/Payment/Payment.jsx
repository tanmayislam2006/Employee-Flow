import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useParams } from "react-router";
import PaymentForm from "./PaymnetForm";
const stripePromise=loadStripe(import.meta.env.VITE_STRIPE_PK);
const Payment = () => {
  const { id } = useParams();
  return <div>
    <Elements stripe={stripePromise}>
     <PaymentForm id={id} />
    </Elements>
  </div>;
};

export default Payment;
