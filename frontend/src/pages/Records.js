import { useEffect, useState } from "react";

function Records() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);

  // ===== LOAD DATA =====
  const loadData = () => {
    fetch("https://s-courier-system.onrender.com/api/courier")
      .then(res => res.json())
      .then(result => setData(result));
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===== DELETE =====
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );

    if (!confirmDelete) return;

    await fetch(
      `https://s-courier-system.onrender.com/api/courier/${selected._id}`,
      { method: "DELETE" }
    );

    alert("Entry deleted ✅");

    setSelected(null);
    loadData();
  };

  // ===== UPDATE =====
  const handleUpdate = async () => {
    await fetch(
      `https://s-courier-system.onrender.com/api/courier/${selected._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected)
      }
    );

    alert("Entry updated ✅");

    setEditing(false);
    setSelected(null);
    loadData();
  };

  return (
    <div className="container">
      <h2>Courier Records</h2>

      <table className="records-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Receiver</th>
            <th>Center</th>
            <th>Charge</th>
          </tr>
        </thead>

        <tbody>
          {data.map(item => (
            <tr
              key={item._id}
              onClick={() => {
                setSelected(item);
                setEditing(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.clientName}</td>
              <td>{item.receiverName}</td>
              <td>{item.center}</td>
              <td>₹{item.charge}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MODAL POPUP ===== */}

      {selected && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>Entry Details</h3>

            {[
              ["Client", "clientName"],
              ["Receiver", "receiverName"],
                ["Address", "address"], 
              ["Center", "center"],
              ["Weight", "weight"],
              ["Charge", "charge"],
              ["Type", "type"],
              ["Courier Type", "courierType"],
              ["Docket No", "docketNumber"],
              ["Mode", "mode"],
              ["Phone", "phone"]
            ].map(([label, field]) => (
              <p key={field}>
                <b>{label}:</b>{" "}
                {editing ? (
                  <input
                    value={selected[field] || ""}
                    onChange={e =>
                      setSelected({
                        ...selected,
                        [field]: e.target.value
                      })
                    }
                  />
                ) : (
                  selected[field]
                )}
              </p>
            ))}

            {/* ACTION BUTTONS */}

            <div style={{ marginTop: "20px" }}>

              {!editing && (
                <button onClick={() => setEditing(true)}>
                  Edit
                </button>
              )}

              {editing && (
                <button onClick={handleUpdate}>
                  Save
                </button>
              )}

              <button
                onClick={handleDelete}
                style={{ marginLeft: "10px", background: "#e74c3c" }}
              >
                Delete
              </button>

              <button
                onClick={() => setSelected(null)}
                style={{ marginLeft: "10px", background: "#7f8c8d" }}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Records;