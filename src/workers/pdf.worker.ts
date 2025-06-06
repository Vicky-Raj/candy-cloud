import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Types redefined here to avoid module resolution issues in web workers.
interface OrderItemValue {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

interface AddOrderFormValues {
  orderId: string;
  orderDate: Date | null;
  deliveryDate?: Date | null;
  paymentType: string;
  comments?: string;
  orderItems: OrderItemValue[];
}

interface Customer {
  id?: string;
  name: string;
  mobile?: string;
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
}

interface WorkerData {
  orderData: AddOrderFormValues;
  parentCustomerData: Customer;
}

self.onmessage = async (e: MessageEvent<WorkerData>) => {
  const { orderData, parentCustomerData } = e.data;

  try {
    const doc = new jsPDF();
    const {
      orderId,
      orderDate,
      deliveryDate,
      paymentType,
      orderItems,
      comments,
    } = orderData;

    const customerPhone =
      parentCustomerData?.mobile || parentCustomerData?.phone;

    let yPos = 20;
    const lineSpacing = 6;
    const sectionSpacing = 10;
    const leftMargin = 14;
    const contentWidth = doc.internal.pageSize.getWidth() - leftMargin * 2;

    doc.setFontSize(20);
    doc.text("Invoice", doc.internal.pageSize.getWidth() / 2, yPos, {
      align: "center",
    });
    yPos += sectionSpacing;

    doc.setFontSize(12);
    doc.text("Customer Details:", leftMargin, yPos);
    yPos += lineSpacing + 1;
    doc.setFontSize(10);

    doc.text(`Name: ${parentCustomerData.name}`, leftMargin, yPos);
    yPos += lineSpacing;

    if (customerPhone) {
      doc.text(`Phone: ${customerPhone}`, leftMargin, yPos);
      yPos += lineSpacing;
    }

    let fullAddress = parentCustomerData.address || "";
    if (parentCustomerData.city) {
      fullAddress += `${fullAddress ? ", " : ""}${parentCustomerData.city}`;
    }
    if (parentCustomerData.postCode) {
      fullAddress += `${fullAddress ? ", " : ""}${parentCustomerData.postCode}`;
    }

    if (fullAddress) {
      const addressLines = doc.splitTextToSize(
        `Address: ${fullAddress}`,
        contentWidth
      );
      doc.text(addressLines, leftMargin, yPos);
      yPos += lineSpacing * addressLines.length;
    }

    yPos += sectionSpacing / 2;

    doc.setFontSize(12);
    doc.text("Order Details:", leftMargin, yPos);
    yPos += lineSpacing + 1;
    doc.setFontSize(10);

    doc.text(`Order ID: ${orderId}`, leftMargin, yPos);
    yPos += lineSpacing;

    doc.text(
      `Order Date: ${
        orderDate ? new Date(orderDate).toLocaleDateString() : "N/A"
      }`,
      leftMargin,
      yPos
    );
    yPos += lineSpacing;

    if (deliveryDate) {
      doc.text(
        `Delivery Date: ${new Date(deliveryDate).toLocaleDateString()}`,
        leftMargin,
        yPos
      );
      yPos += lineSpacing;
    }

    doc.text(`Payment Type: ${paymentType}`, leftMargin, yPos);
    yPos += sectionSpacing;

    const tableColumn = [
      "Image",
      "Product Name",
      "Quantity",
      "Unit Price",
      "Total Price",
    ];
    const tableRows: (string | number)[][] = [];
    let grandTotal = 0;

    orderItems.forEach((item) => {
      const totalPrice = item.quantity * item.unitPrice;
      grandTotal += totalPrice;
      const itemData = [
        item.image,
        item.name,
        item.quantity,
        `$${item.unitPrice.toFixed(2)}`,
        `$${totalPrice.toFixed(2)}`,
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      startY: yPos,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [22, 160, 133],
        minCellHeight: 12,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
      },
      styles: {
        minCellHeight: 25,
      },
      didDrawCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === 0 &&
          data.cell.raw
        ) {
          const imgUrl = data.cell.raw as string;
          const cellPadding = 2;
          const availableWidth = data.cell.width - 2 * cellPadding;
          const availableHeight = data.cell.height - 2 * cellPadding;
          const imgSize = Math.min(availableWidth, availableHeight);

          const x = data.cell.x + (data.cell.width - imgSize) / 2;
          const y = data.cell.y + (data.cell.height - imgSize) / 2;

          try {
            doc.addImage(imgUrl, "JPEG", x, y, imgSize, imgSize);
          } catch (e) {
            console.error(`Error adding image ${imgUrl} to PDF:`, e);
            const errorText = "No img";
            doc.setFontSize(6);
            doc.setTextColor(100);
            doc.text(
              errorText,
              data.cell.x + data.cell.width / 2,
              data.cell.y + data.cell.height / 2,
              { align: "center", baseline: "middle" }
            );
            doc.setTextColor(0);
          }
        }
      },
      foot: [
        [
          {
            content: "Grand Total",
            colSpan: 4,
            styles: {
              halign: "right",
              fontStyle: "bold",
              textColor: [0, 0, 0],
            },
          },
          {
            content: `$${grandTotal.toFixed(2)}`,
            styles: {
              fontStyle: "bold",
              textColor: [0, 0, 0],
              halign: "right",
            },
          },
        ],
      ],
      footStyles: { fontStyle: "bold", fillColor: undefined },
      didDrawPage: (data) => {
        yPos = data.cursor?.y || 0;
      },
    });

    yPos = (doc as any).lastAutoTable.finalY || yPos;
    yPos += sectionSpacing;

    if (comments && comments.trim() !== "") {
      doc.setFontSize(10);
      doc.text("Comments:", leftMargin, yPos);
      yPos += lineSpacing - 1;
      const splitComments = doc.splitTextToSize(comments, contentWidth);
      doc.text(splitComments, leftMargin, yPos);
    }

    const blob = doc.output("blob");
    self.postMessage({ success: true, blob });
  } catch (error) {
    console.error("Error in PDF worker:", error);
    self.postMessage({ success: false, error: (error as Error).message });
  }
};
