const express = require("express");
const ExcelJS = require("exceljs");
const Courier = require("../models/Courier");

const router = express.Router();

// ===== EXPORT BILL TO EXCEL =====
router.get("/excel", async (req, res) => {
  try {
    const {
      clientName,
      month,
      year,
      fuel = 0,
      gst = 0,
      extra = 0,
      includeDetails = "true"
    } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const entries = await Courier.find({
      clientName,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalCharges = entries.reduce(
      (sum, item) => sum + (item.charge || 0),
      0
    );

    const fuelAmount = (totalCharges * fuel) / 100;
    const subtotal = totalCharges + fuelAmount;
    const gstAmount = (subtotal * gst) / 100;
    const grandTotal = subtotal + gstAmount + Number(extra);

    // ===== CREATE EXCEL =====
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Bill");

    // SUMMARY
    sheet.addRow(["Client", clientName]);
    sheet.addRow(["Month", month]);
    sheet.addRow(["Year", year]);
    sheet.addRow([]);
    sheet.addRow(["Total Shipments", entries.length]);
    sheet.addRow(["Total Charges", totalCharges]);
    sheet.addRow(["Fuel Amount", fuelAmount]);
    sheet.addRow(["GST Amount", gstAmount]);
    sheet.addRow(["Extra", extra]);
    sheet.addRow(["Grand Total", grandTotal]);

    // OPTIONAL DETAILS
    if (includeDetails === "true") {
      sheet.addRow([]);
      sheet.addRow(["Shipment Details"]);
      sheet.addRow(["Docket", "Receiver", "Center", "Charge", "Mode"]);

      entries.forEach(e => {
        sheet.addRow([
          e.docketNumber,
          e.receiverName,
          e.center,
          e.charge,
          e.mode
        ]);
      });
    }

    // SEND FILE
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bill_${clientName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.log(error);
    res.status(500).send("Excel generation failed ❌");
  }
});

module.exports = router;
