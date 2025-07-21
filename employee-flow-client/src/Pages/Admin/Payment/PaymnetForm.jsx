// PaymentForm.jsx

/**
 * Stripe PaymentForm Component
 * --------------------------------
 * This component handles payment using Stripe in 4 main steps:
 *
 * 1. Load a payment record based on the payroll ID (via TanStack Query)
 * 2. Create a PaymentMethod with CardElement (Stripe)
 * 3. Send amount to server and receive clientSecret to initiate PaymentIntent
 * 4. Confirm payment via stripe.confirmCardPayment using the clientSecret
 *
 * After successful payment, shows success message and redirects.
 */

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuthProvidor from "../../../Hook/useAuthProvidor";
import useAxiosSecure from "../../../Hook/useAxiosSecure";

const PaymentForm = ({ id }) => {
  const { user } = useAuthProvidor();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch payment info for the given ID
  const { data: paymentInfo = {} } = useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payRoll/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  // 2–4. Stripe payment logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      return;
    }

    setProcessing(true);

    // 2. Create PaymentMethod
    const { error: methodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodError) {
      setError(methodError.message);
      setProcessing(false);
      return;
    }

    setError("");

    // 3. Get client secret from backend
    const { data } = await axiosSecure.post(
      "/create-payment-intent",
      { payRollId: paymentInfo?._id, amount: paymentInfo?.salary },
      { withCredentials: true }
    );

    const clientSecret = data.clientSecret;
    // 4. Confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setSuccess("✅ Payment successful!");
      const TransactionData = {
        transactionId: result.paymentIntent.id,
        amount: paymentInfo?.salary,
        paid_at: new Date(),
        payRollId: paymentInfo?._id,
        paymentMethod: "card",
        pay_for_month: paymentInfo?.month,
        pay_for_year: paymentInfo?.year,
        employeeEmail: paymentInfo?.employeeEmail,
        employeeName: paymentInfo?.employeeName,
      };
      axiosSecure.post("/transaction", TransactionData);
      axiosSecure.patch(`/payRoll/${paymentInfo?._id}`, {
        status: "paid",
      });
      Swal.fire({
        title: "Success",
        text: `Your payment of $${paymentInfo?.salary} was successful!`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect to dashboard or another page
        navigate("/dashboard/payHistory");
      });

      setError("");
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 lg:p-4">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Pay for Salary Sheet
        </h2>

        {/* Payment Info */}
        <div className="mb-4 text-sm bg-base-200 rounded p-4">
          <p>
            <strong>Employee:</strong> {paymentInfo?.employeeName || "N/A"}
          </p>
          <p>
            <strong>Salary:</strong> ${paymentInfo?.salary || 0}
          </p>
          <p>
            <strong>Month:</strong> {paymentInfo?.month || "N/A"},{" "}
            <strong>Year:</strong> {paymentInfo?.year || "N/A"}
          </p>
        </div>

        {/* Stripe Card Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-base-300 p-5 rounded-lg"
        >
          <div className="p-3 border border-gray-300 rounded bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1F2937",
                    "::placeholder": { color: "#9CA3AF" },
                  },
                  invalid: {
                    color: "#EF4444",
                  },
                },
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!stripe || processing|| paymentInfo?.salary <= 0}
          >
            {processing ? "Processing..." : `Pay $${paymentInfo?.salary || 0}`}
          </button>

          {/* Error or Success messages */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
