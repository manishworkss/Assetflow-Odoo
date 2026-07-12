import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Unique ID for the scanner div
    const scannerId = "assetflow-qr-reader";
    
    // Config for the scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    const scanner = new Html5QrcodeScanner(scannerId, config, false);

    const handleScanSuccess = (decodedText, decodedResult) => {
      // Pause scanner after success
      scanner.pause();
      
      try {
        const data = JSON.parse(decodedText);
        if (data.type === 'assetflow' && data.tag) {
          onScanSuccess(data.tag);
        } else {
          // If it's just raw text, assume it might be a tag directly
          onScanSuccess(decodedText);
        }
      } catch (e) {
        // Not a JSON payload, maybe just the raw tag text
        onScanSuccess(decodedText);
      }
    };

    const handleScanError = (errorMessage) => {
      // html5-qrcode triggers this constantly while scanning (it's noisy), so we mostly ignore it
      // unless we want to log it
    };

    scanner.render(handleScanSuccess, handleScanError);

    // Cleanup function
    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Scan Asset QR Code</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 flex flex-col items-center">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded w-full text-center">
              {error}
            </div>
          )}
          <div id="assetflow-qr-reader" className="w-full"></div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Position the QR code within the frame to scan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
