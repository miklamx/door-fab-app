// Updated app.js

// Assuming using React for toggle behavior
import React, { useState } from 'react';

const App = () => {
    const [toggle, setToggle] = useState('Quote'); // Default to Quote

    const handleToggle = (event) => {
        setToggle(event.target.value);
    };

    return (
        <div>
            <h1>Customer Information</h1>
            <select onChange={handleToggle} value={toggle}>
                <option value="Quote">Quote</option>
                <option value="Order">Order</option>
            </select>
            <div>
                <label>Customer Name:</label>
                <input type="text" />
                <label>Account #:</label>
                <input type="text" />
                <label>Phone:</label>
                <input type="text" />
            </div>
            {toggle === 'Order' && (
                <div>
                    <label>PO #:</label>
                    <input type="text" />
                </div>
            )}
        </div>
    );
};

export default App;