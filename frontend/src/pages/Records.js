import { useEffect, useState } from "react";

function Records() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);

  const loadData = () => {
    fetch("https://s-courier-system.onrender.com/api/courier")
      .then(res => res.json())
      .then(result => setData(result));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    await fetch(`https://s-courier-system.onrender.com/api/courier/${selected._id}`, {
      method: "DELETE"
    });

    setSelected(null);
    loadData();
  };

  const handleUpdate = async () => {
    await fetch(`https://s-courier-system.onrender.com/api/courier/${selected._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected)
    });

    setEditing(false);
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
              <td>{item.charge}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== DETAILS PANEL ===== */}

   {selected && (
  <div className="details-box">
    <h3>Entry Details</h3>

    <p>
      <b>Client:</b>{" "}
      {editing ? (
        <input
          value={selected.clientName}
          onChange={e =>
            setSelected({ ...selected, clientName: e.target.value })
          }
        />
      ) : (
        selected.clientName
      )}
    </p>

    <p>
      <b>Receiver:</b>{" "}
      {editing ? (
        <input
          value={selected.receiverName}
          onChange={e =>
            setSelected({ ...selected, receiverName: e.target.value })
          }
        />
      ) : (
        selected.receiverName
      )}
    </p>

    <p>
      <b>Center:</b>{" "}
      {editing ? (
        <input
          value={selected.center}
          onChange={e =>
            setSelected({ ...selected, center: e.target.value })
          }
        />
      ) : (
        selected.center
      )}
    </p>

    <p>
      <b>Weight:</b>{" "}
      {editing ? (
        <input
          value={selected.weight}
          onChange={e =>
            setSelected({ ...selected, weight: e.target.value })
          }
        />
      ) : (
        selected.weight
      )}
    </p>

    <p>
      <b>Charge:</b>{" "}
      {editing ? (
        <input
          value={selected.charge}
          onChange={e =>
            setSelected({ ...selected, charge: e.target.value })
          }
        />
      ) : (
        selected.charge
      )}
    </p>

    <p>
      <b>Type:</b>{" "}
      {editing ? (
        <input
          value={selected.type}
          onChange={e =>
            setSelected({ ...selected, type: e.target.value })
          }
        />
      ) : (
        selected.type
      )}
    </p>

    <p>
      <b>Courier Type:</b>{" "}
      {editing ? (
        <input
          value={selected.courierType}
          onChange={e =>
            setSelected({ ...selected, courierType: e.target.value })
          }
        />
      ) : (
        selected.courierType
      )}
    </p>

    <p>
      <b>Docket No:</b>{" "}
      {editing ? (
        <input
          value={selected.docketNumber}
          onChange={e =>
            setSelected({ ...selected, docketNumber: e.target.value })
          }
        />
      ) : (
        selected.docketNumber
      )}
    </p>

    <p>
      <b>Mode:</b>{" "}
      {editing ? (
        <input
          value={selected.mode}
          onChange={e =>
            setSelected({ ...selected, mode: e.target.value })
          }
        />
      ) : (
        selected.mode
      )}
    </p>

    <p>
      <b>Phone:</b>{" "}
      {editing ? (
        <input
          value={selected.phone}
          onChange={e =>
            setSelected({ ...selected, phone: e.target.value })
          }
        />
      ) : (
        selected.phone
      )}
    </p>

    {/* ACTION BUTTONS */}

    <div style={{ marginTop: "20px" }}>

      {!editing && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}

      {editing && (
        <button onClick={handleUpdate}>Save</button>
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
)}

    </div>
  );
}

export default Records;
