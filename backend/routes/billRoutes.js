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
      extra = 0
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

    // ===== CREATE WORKBOOK =====
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoice");

    // Set column widths
    sheet.columns = [
      { width: 8 },
      { width: 18 },
      { width: 12 },
      { width: 22 },
      { width: 22 },
      { width: 14 },
      { width: 14 }
    ];

    // ===== TITLE =====
    sheet.mergeCells("A1:G1");
    sheet.getCell("A1").value = "COURIER INVOICE";
    sheet.getCell("A1").alignment = { horizontal: "center" };
    sheet.getCell("A1").font = { bold: true, size: 16 };

    // ===== FROM =====
    sheet.getCell("A3").value = "FROM";
    sheet.getCell("A4").value = "SHREE MARUTI COURIER";
    sheet.getCell("A5").value = "Your Address Here";
    sheet.getCell("A6").value = "MOB: 9999999999";
    sheet.getCell("A7").value = "GST: XXXXXXXX";

    // ===== BILL INFO (RIGHT SIDE) =====
    sheet.getCell("E3").value = `MONTH: ${month}`;
    sheet.getCell("E4").value = `BILL DATE: ${startDate.toLocaleDateString()} TO ${endDate.toLocaleDateString()}`;
    sheet.getCell("E5").value = `INVOICE NO: ${Date.now()}`;

    // ===== TO =====
    sheet.getCell("A9").value = "TO";
    sheet.getCell("A10").value = clientName;

    // ===== TABLE HEADER =====
    const headerRow = 12;

    const headers = [
      "Sr No",
      "Doc No",
      "Weight",
      "Sender",
      "Receiver",
      "Center",
      "Freight"
    ];

    headers.forEach((h, i) => {
      const cell = sheet.getCell(headerRow, i + 1);
      cell.value = h;
      cell.font = { bold: true };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" }
      };
    });

    // ===== TABLE DATA =====
    entries.forEach((e, index) => {
      const row = sheet.addRow([
        index + 1,
        e.docketNumber,
        `${e.weight || 0} KG`,
        e.clientName,
        e.receiverName,
        e.center,
        e.charge
      ]);

      row.eachCell(cell => {
        cell.border = {
          bottom: { style: "thin" }
        };
      });
    });

    const footerRow = sheet.lastRow.number + 2;

    // ===== BANK DETAILS =====
    sheet.getCell(`A${footerRow}`).value = "BANK DETAILS";
    sheet.getCell(`A${footerRow + 1}`).value = "BANK: AXIS BANK";
    sheet.getCell(`A${footerRow + 2}`).value = "AC HOLDER: YOUR NAME";
    sheet.getCell(`A${footerRow + 3}`).value = "AC NO: XXXXXXXX";
    sheet.getCell(`A${footerRow + 4}`).value = "IFSC: XXXXX";

    // ===== SUMMARY =====
    sheet.getCell(`E${footerRow}`).value = "BOOKING AMOUNT";
    sheet.getCell(`F${footerRow}`).value = totalCharges;

    sheet.getCell(`E${footerRow + 1}`).value = "GST";
    sheet.getCell(`F${footerRow + 1}`).value = gstAmount;

    sheet.getCell(`E${footerRow + 2}`).value = "TOTAL AMOUNT";
    sheet.getCell(`F${footerRow + 2}`).value = grandTotal;

    sheet.getCell(`E${footerRow + 2}`).font = { bold: true };

    // ===== SEND FILE =====
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${clientName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.log(err);
    res.status(500).send("Invoice generation failed ❌");
  }
});

module.exports = router;
