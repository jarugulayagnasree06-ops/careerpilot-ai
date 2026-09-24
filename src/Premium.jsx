import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "./supabaseClient";
import "./Premium.css";

const packages = [
  {
    id: "resume",
    name: "Resume Starter",
    price: 49,
    features: ["Resume Builder"],
  },
  {
    id: "career",
    name: "Career Starter",
    price: 99,
    features: [
      "Career Analysis",
      "AI Assistant",
      "Career Roadmap",
    ],
  },
  {
    id: "interview",
    name: "Interview Ready",
    price: 149,
    features: [
      "Resume Builder",
      "Interview Practice",
    ],
  },
  {
    id: "placement",
    name: "Placement Pack",
    price: 199,
    features: [
      "Resume Builder",
      "Career Analysis",
      "AI Assistant",
      "Career Roadmap",
      "Interview Practice",
      "Project Generator",
    ],
  },
  {
    id: "pro",
    name: "CareerPilot Pro",
    price: 299,
    features: [
      "Career Analysis",
      "AI Assistant",
      "Career Roadmap",
      "Resume Builder",
      "Interview Practice",
      "Project Generator",
      "Study Planner",
      "Job Opportunities",
    ],
  },
];

const upiId = "9100725421@ybl";

function Premium({ onNavigate }) {
  const [selectedPackage, setSelectedPackage] = useState(
    packages[0]
  );

  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] =
    useState(null);

  const [paymentStatus, setPaymentStatus] =
    useState("none");

  const [existingPayment, setExistingPayment] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // CHECK PAYMENT FROM SUPABASE
  // --------------------------------------------------
  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("payments")
        .select(
          "id, package_id, package_name, amount, transaction_id, upi_id, screenshot_url, status, submitted_at, approved_at"
        )
        .eq("user_id", user.id)
        .order("submitted_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Payment loading error:",
          error
        );
        setLoading(false);
        return;
      }

      if (data) {
        setExistingPayment(data);

        if (data.status === "approved") {
          setPaymentStatus("approved");

          const foundPackage = packages.find(
            (item) => item.id === data.package_id
          );

          if (foundPackage) {
            setSelectedPackage(foundPackage);
          }
        } else if (data.status === "pending") {
          setPaymentStatus("pending");

          const foundPackage = packages.find(
            (item) => item.id === data.package_id
          );

          if (foundPackage) {
            setSelectedPackage(foundPackage);
          }
        } else {
          setPaymentStatus("rejected");
        }
      } else {
        setPaymentStatus("none");
      }
    } catch (error) {
      console.error(
        "Unexpected payment error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SELECT PACKAGE
  // --------------------------------------------------
  const handlePackageSelect = (pkg) => {
    if (paymentStatus === "approved") {
      return;
    }

    setSelectedPackage(pkg);
    setMessage("");
  };

  // --------------------------------------------------
  // SCREENSHOT
  // --------------------------------------------------
  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "Screenshot must be smaller than 5 MB."
      );
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "Please upload PNG, JPG or WEBP image."
      );
      return;
    }

    setPaymentScreenshot(file);
    setMessage("");
  };

  // --------------------------------------------------
  // SUBMIT PAYMENT
  // --------------------------------------------------
  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      setMessage(
        "Please enter your transaction ID."
      );
      return;
    }

    if (!paymentScreenshot) {
      setMessage(
        "Please upload your payment screenshot."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage(
          "Please login before submitting payment."
        );
        setSubmitting(false);
        return;
      }

      // File extension
      const fileExtension =
        paymentScreenshot.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      // Unique storage path
      const filePath = `${user.id}/${Date.now()}.${fileExtension}`;

      // Upload screenshot
      const { error: uploadError } =
        await supabase.storage
          .from("payment-screenshots")
          .upload(
            filePath,
            paymentScreenshot,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );

      if (uploadError) {
        console.error(
          "Screenshot upload error:",
          uploadError
        );

        setMessage(
          uploadError.message ||
            "Screenshot upload failed."
        );

        setSubmitting(false);
        return;
      }

      // Insert payment
      const { data, error } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          package_id: selectedPackage.id,
          package_name: selectedPackage.name,
          amount: selectedPackage.price,
          transaction_id:
            transactionId.trim(),
          upi_id: upiId,
          screenshot_url: filePath,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error(
          "Payment insert error:",
          error
        );

        setMessage(
          error.message ||
            "Payment submission failed."
        );

        setSubmitting(false);
        return;
      }

      setExistingPayment(data);
      setPaymentStatus("pending");
      setTransactionId("");
      setPaymentScreenshot(null);

      setMessage(
        "Payment submitted successfully. Waiting for admin verification."
      );
    } catch (error) {
      console.error(
        "Payment submission error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "45px" }}>
          💳
        </div>

        <h2>Checking your payment...</h2>
      </div>
    );
  }

  // --------------------------------------------------
  // APPROVED
  // --------------------------------------------------
  if (paymentStatus === "approved") {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "60px auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #ffffff, #f1fff7)",
            borderRadius: "25px",
            padding: "50px 30px",
            textAlign: "center",
            boxShadow:
              "0 15px 45px rgba(0,0,0,0.10)",
          }}
        >
          <div
            style={{
              fontSize: "70px",
              marginBottom: "15px",
            }}
          >
            🎉
          </div>

          <h1
            style={{
              color: "#16834d",
              marginBottom: "12px",
            }}
          >
            Premium Unlocked!
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "17px",
            }}
          >
            Your payment has been verified.
          </p>

          <div
            style={{
              margin:
                "25px auto",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "15px",
              maxWidth: "450px",
            }}
          >
            <p>
              <strong>Package:</strong>{" "}
              {existingPayment?.package_name}
            </p>

            <p>
              <strong>Amount:</strong> ₹
              {existingPayment?.amount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: "#16834d",
                  fontWeight: "700",
                }}
              >
                APPROVED
              </span>
            </p>
          </div>

          <button
            onClick={() =>
              onNavigate?.("home")
            }
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "14px 30px",
              background:
                "linear-gradient(135deg, #6c5ce7, #8e44ad)",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Go to Dashboard 🚀
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PENDING
  // --------------------------------------------------
  if (paymentStatus === "pending") {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "60px auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "50px 30px",
            textAlign: "center",
            boxShadow:
              "0 15px 45px rgba(0,0,0,0.10)",
          }}
        >
          <div
            style={{
              fontSize: "65px",
              marginBottom: "15px",
            }}
          >
            ⏳
          </div>

          <h1>Payment Under Verification</h1>

          <p
            style={{
              color: "#666",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Your payment has been submitted.
            <br />
            Please wait while the administrator
            verifies your payment.
          </p>

          <div
            style={{
              margin: "25px auto",
              padding: "20px",
              background: "#fff8e8",
              borderRadius: "15px",
              maxWidth: "450px",
            }}
          >
            <p>
              <strong>Package:</strong>{" "}
              {existingPayment?.package_name}
            </p>

            <p>
              <strong>Amount:</strong> ₹
              {existingPayment?.amount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: "#d68910",
                  fontWeight: "700",
                }}
              >
                PENDING
              </span>
            </p>
          </div>

          <button
            onClick={loadPayment}
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "10px",
              background: "#6c5ce7",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🔄 Check Payment Status
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PREMIUM PAGE
  // --------------------------------------------------
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            marginBottom: "10px",
          }}
        >
          🚀 CareerPilot Premium
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "17px",
          }}
        >
          One-time payment. No monthly subscription.
        </p>
      </div>

      {/* PACKAGES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
          marginBottom: "45px",
        }}
      >
        {packages.map((pkg) => {
          const selected =
            selectedPackage.id === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() =>
                handlePackageSelect(pkg)
              }
              style={{
                cursor: "pointer",
                padding: "24px 18px",
                borderRadius: "18px",
                background: "white",
                border: selected
                  ? "3px solid #6c5ce7"
                  : "2px solid #eeeeee",
                boxShadow: selected
                  ? "0 10px 30px rgba(108,92,231,0.20)"
                  : "0 5px 18px rgba(0,0,0,0.05)",
                transform: selected
                  ? "translateY(-3px)"
                  : "none",
                transition: "0.2s",
              }}
            >
              <h3>{pkg.name}</h3>

              <div
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: "#6c5ce7",
                  margin: "12px 0",
                }}
              >
                ₹{pkg.price}
              </div>

              {pkg.features.map(
                (feature) => (
                  <div
                    key={feature}
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      marginBottom: "7px",
                    }}
                  >
                    ✓ {feature}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* PAYMENT AREA */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          borderRadius: "25px",
          padding: "35px",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Pay ₹{selectedPackage.price}
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
          }}
        >
          {selectedPackage.name}
        </p>

        {/* QR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "25px 0",
          }}
        >
          <div
            style={{
              padding: "15px",
              background: "white",
              borderRadius: "15px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <QRCodeSVG
              value={`upi://pay?pa=${upiId}&pn=CareerPilot%20AI&am=${selectedPackage.price}&cu=INR`}
              size={220}
            />
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <p>
            <strong>UPI ID</strong>
          </p>

          <code
            style={{
              background: "#f2f2f2",
              padding: "8px 12px",
              borderRadius: "7px",
            }}
          >
            {upiId}
          </code>
        </div>

        {/* TRANSACTION ID */}
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
          }}
        >
          Transaction ID
        </label>

        <input
          type="text"
          value={transactionId}
          onChange={(e) =>
            setTransactionId(e.target.value)
          }
          placeholder="Enter your UPI transaction ID"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "20px",
            fontSize: "15px",
          }}
        />

        {/* SCREENSHOT */}
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
          }}
        >
          Payment Screenshot
        </label>

        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleScreenshotChange}
          style={{
            width: "100%",
            marginBottom: "20px",
          }}
        />

        {paymentScreenshot && (
          <p
            style={{
              color: "#16834d",
              fontSize: "14px",
            }}
          >
            ✓ {paymentScreenshot.name}
          </p>
        )}

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              padding: "13px",
              marginBottom: "20px",
              borderRadius: "10px",
              background: message.includes(
                "successfully"
              )
                ? "#eafaf1"
                : "#fff0f0",
              color: message.includes(
                "successfully"
              )
                ? "#16834d"
                : "#c0392b",
            }}
          >
            {message}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmitPayment}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: submitting
              ? "#aaa"
              : "linear-gradient(135deg, #6c5ce7, #8e44ad)",
            color: "white",
            fontSize: "16px",
            fontWeight: "700",
            cursor: submitting
              ? "not-allowed"
              : "pointer",
          }}
        >
          {submitting
            ? "Submitting..."
            : `Submit ₹${selectedPackage.price} Payment`}
        </button>
      </div>
    </div>
  );
}

export default Premium;