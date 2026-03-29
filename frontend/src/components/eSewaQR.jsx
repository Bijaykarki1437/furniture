// components/eSewaQR.jsx
import React, { useState } from 'react';

function ESewaQR({ onPaymentComplete }) {
  const [step, setStep] = useState('qr'); // qr, upload, verification
  const [transactionCode, setTransactionCode] = useState('');
  const [transactionImage, setTransactionImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      if (!file.type.includes('image')) {
        setError('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setTransactionImage(file);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmitPayment = () => {
  if (!transactionCode) {
    setError('Please enter transaction code');
    return;
  }

  if (!transactionImage) {
    setError('Please upload transaction screenshot');
    return;
  }

  const paymentData = {
    transactionCode,
    transactionImage: uploadedImage, // base64 image
    timestamp: new Date().toISOString(),
    status: 'pending_verification'
  };

  // ✅ send to parent (Checkout)
  onPaymentComplete(paymentData);
};

  return (
    <div className="esewa-payment-container">
      {step === 'qr' && (
        <div className="qr-section">
          <h4>Pay with eSewa</h4>
          <div className="qr-code">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/QR_code_example.svg/1200px-QR_code_example.svg.png" 
              alt="eSewa QR Code"
              style={{ width: '200px', height: '200px', objectFit: 'contain' }}
            />
            <p className="qr-instruction">Scan this QR code with eSewa app to pay</p>
            <p className="qr-amount">Amount: Rs. {localStorage.getItem('pending_amount') || '0'}</p>
          </div>
          <button 
            className="next-step-btn"
            onClick={() => setStep('upload')}
          >
            I have completed payment
          </button>
        </div>
      )}

      {step === 'upload' && (
        <div className="upload-section">
          <h4>Payment Verification</h4>
          <div className="form-group">
            <label>Transaction Code *</label>
            <input
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              placeholder="Enter eSewa transaction code"
            />
          </div>
          
          <div className="form-group">
            <label>Upload Payment Screenshot *</label>
            <div className="file-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="payment-screenshot"
              />
              <label htmlFor="payment-screenshot" className="upload-label">
                {uploadedImage ? (
                  <div className="uploaded-preview">
                    <img src={uploadedImage} alt="Uploaded" />
                    <span>Click to change</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    📸 Click to upload screenshot
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button className="back-btn" onClick={() => setStep('qr')}>
              Back
            </button>
            <button className="submit-payment-btn" onClick={handleSubmitPayment}>
              Submit for Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ESewaQR;