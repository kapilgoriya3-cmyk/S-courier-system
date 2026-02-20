import { useState } from "react";

function AddEntry() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    receiverName: "",
    center: "",
    weight: "",
    charge: "",
    type: "",
    courierType: "",
    docketNumber: "",
    mode: "",
    phone: "",
  });

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ===== VALIDATION =====
  const validateForm = () => {
    if (!formData.clientName.trim()) return "Client name required";
    if (!formData.receiverName.trim()) return "Receiver name required";
    if (!formData.center.trim()) return "Center required";

    if (!formData.charge || Number(formData.charge) <= 0)
      return "Valid charge required";

    if (formData.weight && Number(formData.weight) < 0)
      return "Weight cannot be negative";

    if (!/^\d{10}$/.test(formData.phone))
      return "Phone must be exactly 10 digits";

    if (!formData.type) return "Select Type";
    if (!formData.mode) return "Select Mode";

    return null;
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      weight: formData.weight ? Number(formData.weight) : 0,
      charge: Number(formData.charge),
      docketNumber: formData.docketNumber
        ? Number(formData.docketNumber)
        : "",
    };

    const response = await fetch(
      "https://s-courier-system.onrender.com/api/courier",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      alert("Entry Saved ✅");

      setFormData({
        clientName: "",
        receiverName: "",
        center: "",
        weight: "",
        charge: "",
        type: "",
        courierType: "",
        docketNumber: "",
        mode: "",
        phone: "",
      });
    } else {
      const data = await response.json();
      alert(data.error || "Failed to save ❌");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container">
      <h2>Add Courier Entry</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        <div className="form-group">
          <label>Client Name</label>
          <input
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Receiver Name</label>
          <input
            name="receiverName"
            value={formData.receiverName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Center</label>
          <input
            name="center"
            value={formData.center}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Charge (₹)</label>
          <input
            type="number"
            name="charge"
            value={formData.charge}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Courier Type</label>
          <input
            name="courierType"
            value={formData.courierType}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Docket Number</label>
          <input
            type="number"
            name="docketNumber"
            value={formData.docketNumber}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            required
          />
        </div>

        {/* ===== TYPE DROPDOWN ===== */}
        <div className="form-group full-width">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="DOC">DOC</option>
            <option value="NON-DOC">NON-DOC</option>
          </select>
        </div>

        {/* ===== MODE DROPDOWN ===== */}
        <div className="form-group full-width">
          <label>Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
          >
            <option value="">Select Mode</option>
            <option value="AIR">AIR</option>
            <option value="SURFACE">SURFACE</option>
            <option value="FAST TRACK">FAST TRACK</option>
          </select>
        </div>

        <div className="form-group full-width">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Entry"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddEntry;