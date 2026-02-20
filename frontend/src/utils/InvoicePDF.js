import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const getInvoiceHTML = (order) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f97316; padding-bottom: 15px;">
        <h1 style="color: #f97316; margin: 0 0 5px 0; font-size: 28px;">STEPOUT ECOMMERCE</h1>
        <p style="margin: 0; color: #666;">Invoice</p>
      </div>

      <!-- Invoice Details -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <p style="margin: 0; font-weight: bold;">Invoice Details</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Order Date:</strong> ${new Date(
    order.createdAt
  ).toLocaleDateString()}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <div>
          <p style="margin: 0; font-weight: bold;">Payment Details</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> ${order.orderStatus}</p>
        </div>
      </div>

      <!-- Bill To Section -->
      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-weight: bold; border-bottom: 2px solid #f97316; padding-bottom: 5px;">BILL TO</p>
        <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">${order.shippingAddress.fullName}</p>
        <p style="margin: 5px 0; font-size: 13px;">${order.shippingAddress.addressLine1}${
    order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''
  }</p>
        <p style="margin: 5px 0; font-size: 13px;">${order.shippingAddress.city}, ${
    order.shippingAddress.state
  } - ${order.shippingAddress.pincode}</p>
        <p style="margin: 5px 0; font-size: 13px;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f97316; color: white;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Product Name</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Size</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Qty</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Price</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr style="border: 1px solid #ddd;">
              <td style="padding: 12px; border: 1px solid #ddd;">${item.productName}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.size || 'N/A'}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">₹${(
                item.price * item.quantity
              ).toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Summary -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 350px;">
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
            <span>Subtotal:</span>
            <span>₹${order.totalAmount.toFixed(2)}</span>
          </div>
          ${
            order.discount > 0
              ? `<div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; color: #28a745;">
            <span>Discount:</span>
            <span>-₹${order.discount.toFixed(2)}</span>
          </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; padding: 10px 0; font-weight: bold; font-size: 16px; color: #f97316;">
            <span>Total Amount:</span>
            <span>₹${order.finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #f97316; padding-top: 15px; text-align: center; color: #666; font-size: 12px;">
        <p style="margin: 5px 0;">Thank you for shopping with us!</p>
        <p style="margin: 5px 0;">For any queries, contact: support@stepout.com</p>
        <p style="margin: 5px 0; margin-top: 15px; font-size: 11px;">This is a computer-generated invoice.</p>
      </div>
    </div>
  `;
};

const InvoicePDF = {
  downloadInvoice: async (order) => {
    try {
      // Create a temporary div to hold the invoice HTML
      const invoiceDiv = document.createElement('div');
      invoiceDiv.innerHTML = getInvoiceHTML(order);
      
      // Append to body temporarily for html2canvas to work properly
      invoiceDiv.style.position = 'absolute';
      invoiceDiv.style.left = '-9999px';
      invoiceDiv.style.width = '800px';
      document.body.appendChild(invoiceDiv);

      try {
        // Convert HTML to Canvas
        const canvas = await html2canvas(invoiceDiv, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
        });

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pdfWidth - 10;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);

        // Download PDF
        pdf.save(`Invoice_${order.orderNumber}.pdf`);
      } finally {
        // Remove the temporary element
        document.body.removeChild(invoiceDiv);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  },

  printInvoice: (order) => {
    try {
      // Create a temporary window for printing
      const printWindow = window.open('', '_blank');
      const invoiceHTML = getInvoiceHTML(order);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${order.orderNumber}</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${invoiceHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Error printing invoice:', error);
      throw error;
    }
  },
};

export default InvoicePDF;
