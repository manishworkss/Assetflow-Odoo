import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const AssetQRCode = ({ assetTag, size = 128 }) => {
  // We encode the asset tag so that our scanner knows what to look for
  // In a real app, this might be a full URL to the asset details page
  const qrValue = JSON.stringify({ type: 'assetflow', tag: assetTag });

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <QRCodeSVG value={qrValue} size={size} level="H" />
      <span className="mt-2 text-sm font-medium text-gray-600 font-mono">{assetTag}</span>
    </div>
  );
};

export default AssetQRCode;
