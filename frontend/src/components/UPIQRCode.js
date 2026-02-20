import QRCode from 'qrcode.react';

const UPIQRCode = ({ amount, upiId }) => {
  // UPI string format: upi://pay?pa={upiId}&pn={name}&am={amount}&tn={description}
  const upiString = `upi://pay?pa=${upiId}&pn=StepOut%20Ecommerce&am=${amount}&tn=Payment%20to%20StepOut`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-lg border-2 border-orange-500">
        <QRCode
          value={upiString}
          size={256}
          level="H"
          includeMargin={true}
          fgColor="#1f2937"
          bgColor="#ffffff"
        />
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-1">Amount to Pay</p>
        <p className="text-2xl font-bold text-orange-600">₹{amount.toFixed(2)}</p>
      </div>
      <button
        onClick={() => window.open(`${upiString}`, '_blank')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 w-full"
      >
        Pay with UPI
      </button>
    </div>
  );
};

export default UPIQRCode;
