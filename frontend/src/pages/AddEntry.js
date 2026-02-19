import { useState } from "react";

function AddEntry() {
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
    phone: ""
  });

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData({
      ...formData,
      [name]: value
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

    if (!formData.type) return "Select DOC / NON-DOC";
    if (!formData.mode) return "Select AIR / SURFACE";

    return null;
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    // Convert numeric fields before sending
    const payload = {
      ...formData,
      weight: formData.weight ? Number(formData.weight) : 0,
      charge: Number(formData.charge),
      docketNumber: formData.docketNumber
        ? Number(formData.docketNumber)
        : ""
    };

    const response = await fetch("https://s-courier-system.onrender.com/api/courier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

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
        phone: ""
      });
    } else {
      alert("Failed to save ❌");
    }
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

        {/* TYPE */}
        <div className="form-group full-width">
          <label>Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="DOC"
                checked={formData.type === "DOC"}
                onChange={handleChange}
              /> DOC
            </label>

            <label>
              <input
                type="radio"
                name="type"
                value="NON-DOC"
                checked={formData.type === "NON-DOC"}
                onChange={handleChange}
              /> NON-DOC
            </label>
          </div>
        </div>

        {/* MODE */}
        <div className="form-group full-width">
          <label>Mode</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="mode"
                value="AIR"
                checked={formData.mode === "AIR"}
                onChange={handleChange}
              /> AIR
            </label>

            <label>
              <input
                type="radio"
                name="mode"
                value="SURFACE"
                checked={formData.mode === "SURFACE"}
                onChange={handleChange}
              /> SURFACE
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <button type="submit">Save Entry</button>
        </div>

      </form>
    </div>
  );
}

export default AddEntry;
