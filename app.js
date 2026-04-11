// Import required modules
import React, { useState } from 'react';

const CustomerInfo = () => {
    const [docType, setDocType] = useState('Quote');

    return (
        <div className="customer-info">
            <div className="docType-toggle">
                <button
                    className={docType === 'Quote' ? 'active' : ''}
                    onClick={() => setDocType('Quote')}
                    style={{ backgroundColor: docType === 'Quote' ? 'blue' : 'transparent' }}
                >Quote</button>
                <button
                    className={docType === 'Order' ? 'active' : ''}
                    onClick={() => setDocType('Order')}
                    style={{ backgroundColor: docType === 'Order' ? 'blue' : 'transparent' }}
                >Order</button>
            </div>
            <form>
                {/* Other form fields go here */}
                <input
                    type="hidden"
                    name="docType"
                    value={docType}
                />
            </form>
        </div>
    );
};

export default CustomerInfo;