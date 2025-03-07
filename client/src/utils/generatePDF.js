import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import pdfFont from "../forms/Ubuntu-R.ttf";
import iconsFont from "../forms/Wingdings2.ttf";

/**
 * Generates a filled PDF based on the provided formData.
 * @param {Object} formData - Data to populate the PDF form.
 * @returns {Promise<Uint8Array>} - The filled PDF as a byte array.
 */
export const generateFilledPDF = async (formData) => {
  try {
    // Fetch and load font bytes for embedding
    const fontBytes = await fetch(pdfFont).then((res) => res.arrayBuffer());
    const fontBytesIcons = await fetch(iconsFont).then((res) => res.arrayBuffer());

    // Fetch the base PDF file
    const pdfUrl = `${process.env.PUBLIC_URL}/forms/Register_Form.pdf`;
    const pdfData = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfData);

    // Register fontkit and embed fonts
    pdfDoc.registerFontkit(fontkit);
    const ubuntuFont = await pdfDoc.embedFont(fontBytes, { subset: true });
    const pdfIconsFont = await pdfDoc.embedFont(fontBytesIcons, { subset: true });

    // Retrieve pages from the PDF document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];

    // Draw form data on the first page
    firstPage.drawText(formData.guestName, {
      x: 165,
      y: 711,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.address, {
      x: 120,
      y: 690,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.numberOfGuests, {
      x: 165,
      y: 670,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.numberOfRooms, {
      x: 460,
      y: 670,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.roomType, {
      x: 350,
      y: 650,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.arrivalDate, {
      x: 90,
      y: 607,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.arrivalTime, {
      x: 210,
      y: 607,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.departureDate, {
      x: 330,
      y: 607,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.departureTime, {
      x: 460,
      y: 607,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });

    // Draw tick marks based on category and add reviewer details if approved
    const tick = "P";
    if (formData.category === "A") {
      if (formData.reviewers) {
        formData.reviewers.forEach((reviewer) => {
          if (reviewer.status === "APPROVED") {
            secondPage.drawText(reviewer.role, {
              x: 55,
              y: 510,
              size: 12,
              font: ubuntuFont,
              color: rgb(0, 0, 0),
            });
          }
        });
      }
      firstPage.drawText(tick, {
        x: 125,
        y: 510,
        size: 25,
        font: pdfIconsFont,
        color: rgb(0, 0, 0),
      });
    }
    if (formData.category === "B") {
      if (formData.reviewers) {
        formData.reviewers.forEach((reviewer) => {
          if (reviewer.status === "APPROVED") {
            secondPage.drawText(reviewer.role, {
              x: 55,
              y: 510,
              size: 12,
              font: ubuntuFont,
              color: rgb(0, 0, 0),
            });
          }
        });
      }
      firstPage.drawText(tick, {
        x: 255,
        y: 510,
        size: 25,
        font: pdfIconsFont,
        color: rgb(0, 0, 0),
      });
    }
    if (formData.category === "C") {
      if (formData.reviewers) {
        formData.reviewers.forEach((reviewer) => {
          if (reviewer.status === "APPROVED") {
            secondPage.drawText(reviewer.role, {
              x: 55,
              y: 510,
              size: 12,
              font: ubuntuFont,
              color: rgb(0, 0, 0),
            });
          }
        });
      }
      firstPage.drawText(tick, {
        x: 385,
        y: 510,
        size: 25,
        font: pdfIconsFont,
        color: rgb(0, 0, 0),
      });
    }
    if (formData.category === "D") {
      if (formData.reviewers) {
        formData.reviewers.forEach((reviewer) => {
          if (reviewer.status === "APPROVED") {
            secondPage.drawText(reviewer.role, {
              x: 55,
              y: 510,
              size: 12,
              font: ubuntuFont,
              color: rgb(0, 0, 0),
            });
          }
        });
      }
      firstPage.drawText(tick, {
        x: 515,
        y: 510,
        size: 25,
        font: pdfIconsFont,
        color: rgb(0, 0, 0),
      });
    }

    // Additional form fields
    firstPage.drawText(formData.purpose, {
      x: 175,
      y: 585,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(
      formData.source === "GUEST" ? "YES" : "NO",
      {
        x: 385,
        y: 345,
        size: 12,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      }
    );
    firstPage.drawText(formData.applicant.name, {
      x: 55,
      y: 215,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.applicant.designation, {
      x: 155,
      y: 215,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.applicant.department, {
      x: 255,
      y: 215,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.applicant.code, {
      x: 340,
      y: 215,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(formData.applicant.mobile, {
      x: 440,
      y: 215,
      size: 12,
      font: ubuntuFont,
      color: rgb(0, 0, 0),
    });

    // Save the modified PDF and return its bytes
    const filledPdfBytes = await pdfDoc.save();
    return filledPdfBytes;
  } catch (error) {
    console.error("Error generating filled PDF:", error);
    throw error;
  }
};

/**
 * Updates the filled PDF and returns it as a Blob.
 * @param {Object} formData - Data to populate the PDF form.
 * @returns {Promise<Blob>} - The updated filled PDF as a Blob.
 */
export const updateFilledPDF = async (formData) => {
  try {
    const filledPdfBytes = await generateFilledPDF(formData);
    return new Blob([filledPdfBytes], { type: "application/pdf" });
  } catch (error) {
    console.error("Error updating filled PDF:", error);
    throw error;
  }
};
