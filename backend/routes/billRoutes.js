const express = require("express");
const ExcelJS = require("exceljs");
const Courier = require("../models/Courier");

const router = express.Router();

// ===== EXPORT BILL TO EXCEL =====
router.get("/excel", async (req, res) => {
  try {
    const { clientName, month, year, fuel = 0, gst = 0, extra = 0 } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const entries = await Courier.find({
      clientName,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalCharges = entries.reduce((sum, e) => sum + (e.charge || 0), 0);
    const fuelAmount = (totalCharges * fuel) / 100;
    const subtotal = totalCharges + fuelAmount;
    const gstAmount = (subtotal * gst) / 100;
    const grandTotal = subtotal + gstAmount + Number(extra);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoice");

    // ===== COLUMN WIDTHS =====
    sheet.columns = [
      { width: 6 },   // Sr
      { width: 16 },  // Doc No
      { width: 10 },  // Weight
      { width: 22 },  // Sender
      { width: 22 },  // Receiver
      { width: 14 },  // Center
      { width: 14 }   // Freight
    ];

    // ===== TITLE =====
    sheet.mergeCells("A1:G1");
    const title = sheet.getCell("A1");
    title.value = "COURIER INVOICE";
    title.font = { size: 18, bold: true };
    title.alignment = { horizontal: "center" };

    // ===== FROM =====
    sheet.getCell("A3").value = "FROM:";
    sheet.getCell("A4").value = "SHREE MARUTI COURIER";
    sheet.getCell("A5").value = "Your Address Here";
    sheet.getCell("A6").value = "MOB: 9999999999";
    sheet.getCell("A7").value = "GST: XXXXX";

    // ===== BILL INFO RIGHT =====
    sheet.getCell("E3").value = `MONTH: ${month}/${year}`;
    sheet.getCell("E4").value =
      `BILL DATE: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    sheet.getCell("E5").value = `INVOICE NO: ${Date.now()}`;

    // ===== TO =====
    sheet.getCell("A9").value = "TO:";
    sheet.getCell("A10").value = clientName;

    // ===== TABLE HEADER =====
    const headerRow = 12;

    const headers = [
      "Sr",
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
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "medium" },
        bottom: { style: "medium" },
        left: { style: "medium" },
        right: { style: "medium" }
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
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" }
        };
      });
    });

    const footerRow = sheet.lastRow.number + 2;

    // ===== BANK DETAILS (LEFT BOX) =====
    sheet.getCell(`A${footerRow}`).value = "BANK DETAILS";
    sheet.getCell(`A${footerRow + 1}`).value = "BANK: AXIS BANK";
    sheet.getCell(`A${footerRow + 2}`).value = "A/C HOLDER: YOUR NAME";
    sheet.getCell(`A${footerRow + 3}`).value = "A/C NO: XXXXXXXX";
    sheet.getCell(`A${footerRow + 4}`).value = "IFSC: XXXXX";

    // ===== SUMMARY (RIGHT BOX) =====
    sheet.getCell(`E${footerRow}`).value = "BOOKING AMOUNT";
    sheet.getCell(`F${footerRow}`).value = totalCharges;

    sheet.getCell(`E${footerRow + 1}`).value = "GST";
    sheet.getCell(`F${footerRow + 1}`).value = gstAmount;

    sheet.getCell(`E${footerRow + 2}`).value = "TOTAL AMOUNT";
    sheet.getCell(`F${footerRow + 2}`).value = grandTotal;
    sheet.getCell(`F${footerRow + 2}`).font = { bold: true, size: 14 };

    // ===== SEND FILE =====
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${clientName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.log(error);
    res.status(500).send("Excel generation failed ❌");
  }
});

module.exports = router;
