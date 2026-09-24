import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("submitted_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setMessage(
        "Unable to load payment submissions."
      );
      setLoading(false);
      return;
    }

    setPayments(data || []);
    setLoading(false);
  }

  async function updatePayment(id, status) {
    setProcessingId(id);
    setMessage("");

    const updateData =
      status === "approved"
        ? {
            status: "approved",
            approved_at:
              new Date().toISOString(),
          }
        : {
            status: "rejected",
            approved_at: null,
          };

    const { error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("id", id);

    setProcessingId(null);

    if (error) {
      console.error(error);
      setMessage(
        "Unable to update the payment."
      );
      return;
    }

    setMessage(
      status === "approved"
        ? "Payment approved successfully."
        : "Payment rejected."
    );

    await loadPayments();
  }

  async function viewScreenshot(path) {
    if (!path) {
      setMessage(
        "No payment screenshot was uploaded."
      );
      return;
    }

    const { data, error } =
      await supabase.storage
        .from("payment-screenshots")
        .createSignedUrl(path, 600);

    if (error) {
      console.error(error);
      setMessage(
        "Unable to open the payment screenshot."
      );
      return;
    }

    window.open(
      data.signedUrl,
      "_blank"
    );
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>
            💳
          </div>

          <h2>Loading payments...</h2>

          <p>
            Please wait while we load payment
            submissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <div style={styles.badge}>
              🛠️ ADMIN PANEL
            </div>

            <h1 style={styles.title}>
              Payment Verification
            </h1>

            <p style={styles.subtitle}>
              Review UPI payment submissions
              and verify them manually.
            </p>
          </div>

          <button
            style={styles.refreshButton}
            onClick={loadPayments}
          >
            🔄 Refresh
          </button>
        </div>


        {/* MESSAGE */}

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}


        {/* NO PAYMENTS */}

        {payments.length === 0 ? (
          <div style={styles.emptyCard}>

            <div style={styles.emptyIcon}>
              💳
            </div>

            <h2>
              No payment submissions yet
            </h2>

            <p>
              User payment submissions will
              appear here.
            </p>

          </div>
        ) : (

          <div style={styles.list}>

            {payments.map((payment) => (

              <div
                key={payment.id}
                style={styles.paymentCard}
              >

                {/* TOP */}

                <div style={styles.topRow}>

                  <div>

                    <h2 style={styles.packageName}>
                      {payment.package_name}
                    </h2>

                    <span
                      style={{
                        ...styles.status,
                        ...(payment.status ===
                        "approved"
                          ? styles.approved
                          : payment.status ===
                            "rejected"
                          ? styles.rejected
                          : styles.pending),
                      }}
                    >
                      {payment.status
                        .toUpperCase()}
                    </span>

                  </div>

                  <div style={styles.amount}>
                    ₹{payment.amount}
                  </div>

                </div>


                {/* DETAILS */}

                <div style={styles.details}>

                  <Detail
                    label="Transaction ID"
                    value={
                      payment.transaction_id
                    }
                  />

                  <Detail
                    label="UPI ID"
                    value={payment.upi_id}
                  />

                  <Detail
                    label="Package ID"
                    value={payment.package_id}
                  />

                  <Detail
                    label="Submitted"
                    value={new Date(
                      payment.submitted_at
                    ).toLocaleString()}
                  />

                </div>


                {/* ACTIONS */}

                <div style={styles.actions}>

                  <button
                    style={
                      styles.screenshotButton
                    }
                    onClick={() =>
                      viewScreenshot(
                        payment.screenshot_url
                      )
                    }
                  >
                    🖼️ View Screenshot
                  </button>


                  {payment.status ===
                    "pending" && (
                    <>
                      <button
                        style={
                          styles.approveButton
                        }
                        disabled={
                          processingId ===
                          payment.id
                        }
                        onClick={() =>
                          updatePayment(
                            payment.id,
                            "approved"
                          )
                        }
                      >
                        {processingId ===
                        payment.id
                          ? "Processing..."
                          : "✅ Approve"}
                      </button>


                      <button
                        style={
                          styles.rejectButton
                        }
                        disabled={
                          processingId ===
                          payment.id
                        }
                        onClick={() =>
                          updatePayment(
                            payment.id,
                            "rejected"
                          )
                        }
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}


// =====================================================
// DETAIL COMPONENT
// =====================================================

function Detail({ label, value }) {
  return (
    <div style={styles.detailBox}>
      <div style={styles.detailLabel}>
        {label}
      </div>

      <div style={styles.detailValue}>
        {value || "Not available"}
      </div>
    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "75vh",
    padding: "40px 20px",
    background:
      "linear-gradient(135deg,#eef2ff,#f8fafc)",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#e0e7ff",
    color: "#4338ca",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    color: "#172554",
    fontSize: "32px",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "8px",
  },

  refreshButton: {
    border: "none",
    background: "#4f46e5",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  message: {
    background: "white",
    padding: "15px 18px",
    borderRadius: "12px",
    marginBottom: "20px",
    color: "#334155",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  loadingCard: {
    maxWidth: "500px",
    margin: "80px auto",
    background: "white",
    padding: "45px 30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  loadingIcon: {
    fontSize: "50px",
  },

  emptyCard: {
    background: "white",
    padding: "70px 20px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  emptyIcon: {
    fontSize: "55px",
    marginBottom: "10px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  paymentCard: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  packageName: {
    margin: "0 0 10px",
    color: "#1e293b",
  },

  amount: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#4f46e5",
  },

  status: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
  },

  pending: {
    background: "#fef3c7",
    color: "#92400e",
  },

  approved: {
    background: "#dcfce7",
    color: "#166534",
  },

  rejected: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  details: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "14px",
    marginTop: "25px",
  },

  detailBox: {
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "10px",
  },

  detailLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "5px",
  },

  detailValue: {
    color: "#1e293b",
    fontWeight: "600",
    wordBreak: "break-word",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "25px",
  },

  screenshotButton: {
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#334155",
    padding: "11px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
  },

  approveButton: {
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "11px 18px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
  },

  rejectButton: {
    border: "none",
    background: "#dc2626",
    color: "white",
    padding: "11px 18px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
  },
};