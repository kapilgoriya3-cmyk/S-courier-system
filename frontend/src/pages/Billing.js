import { useEffect, useState } from "react";



function Billing() {
  const [form, setForm] = useState({
    clientName: "",
    month: "",
    year: new Date().getFullYear(),
    fuel: "",
    gst: "",
    extra: "",
  });

  const [bill, setBill] = useState(null);
  const [clients, setClients] = useState([]);

  // Load clients from records
  useEffect(() => {
    fetch("https://s-courier-system.onrender.com/api/courier")
      .then((res) => res.json())
      .then((data) => {
        const uniqueClients = [...new Set(data.map((item) => item.clientName))];
        setClients(uniqueClients);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  



  const generateBill = async () => {

     if (!form.clientName || !form.month) {
    alert("Please select client and month");
    return;
  }
    console.log("Generating bill with:", form);
    const url = `https://s-courier-system.onrender.com/api/bill?clientName=${form.clientName}&month=${form.month}&year=${form.year}&fuel=${form.fuel}&gst=${form.gst}&extra=${form.extra}`;
   
    const res = await fetch(url);
    const data = await res.json();
      console.log("Bill response:", data); // ⭐ ADD THIS
    setBill(data);
  };

  return (
    <div className="container">
      <h2>Generate Monthly Bill</h2>

      <div className="form-grid">
        {/* CLIENT DROPDOWN */}
        <div className="form-group">
          <label>Client</label>
          <select name="clientName" onChange={handleChange}>
            <option value="">Select Client</option>
            {clients.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Month</label>

          <select name="month" onChange={handleChange}>
            <option value="">Select Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="form-group">
          <label>Year</label>
          <input name="year" value={form.year} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Fuel %</label>
          <input name="fuel"type="number" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>GST %</label>
          <input name="gst"  type="number" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Extra Charge</label>
          <input name="extra" type="number" onChange={handleChange} />
        </div>

        <div className="form-group full-width">
          <button onClick={generateBill}>Generate Bill</button>
        </div>
      </div>

      {/* ===== BILL RESULT ===== */}

      {bill && (
        <div className="details-box">
          <h3>Bill Summary</h3>

          <p>
            <b>Total Shipments:</b> {bill.totalShipments}
          </p>
          <p>
            <b>Total Charges:</b> ₹{bill.totalCharges}
          </p>
          <p>
            <b>Fuel Amount:</b> ₹{bill.fuelAmount}
          </p>
          <p>
            <b>GST Amount:</b> ₹{bill.gstAmount}
          </p>
          <p>
            <b>Extra:</b> ₹{bill.extra}
          </p>

          <h2>Grand Total: ₹{bill.grandTotal}</h2>
        </div>
      )}

   {bill && (
  <button
    style={{ marginTop: "12px", background: "#27ae60" }}
    onClick={() => {
      const url =
        `https://s-courier-system.onrender.com/api/bill/excel` +
        `?clientName=${form.clientName}` +
        `&month=${form.month}` +
        `&year=${form.year}` +
        `&fuel=${form.fuel}` +
        `&gst=${form.gst}` +
        `&extra=${form.extra}` +
        `&includeDetails=true`;

      window.open(url);
    }}
  >
    Download Excel
  </button>
)}

    </div>
  );
}

export default Billing;
