import { useState } from "react";
import axios from "axios";
import './App.css'
export default function App() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
  });
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const currencyCode = ['USD', 'CNY', 'ETB', 'EUR','KES','CAD', 'JPY', 'GHS'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/convert',
        formData
      );
      setResult(response?.data);
      setError('');
    } catch (error) {
      setError(
        error?.response ? error?.response?.data : error?.message
      );
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <h1>Global Currency Converter</h1>
        <p>Your go-to solution for real-time currency conversion worldwide</p>
      </section>

      <section className="converter">
        <form onSubmit={handleSubmit}>
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="input"
          >
            <option value=""> from </option>
            {currencyCode.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
  
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="input"
          >
            <option value=""> to </option>
            {currencyCode.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            type="number"
            placeholder="Enter amount"
            className="input"
          />

          <button type="submit" className="submit-button">
            Convert
          </button>
        </form>

        {result && (
          <div className="result">
            <p>
              Converted Amount: {result.convertedAmount} {result.target}
            </p>
            <p>Conversion Rate: {result.conversionRate}</p>
          </div>
        )}

        {error && <p className="error">Error: {error}</p>}
      </section>

      <section className="addtional-data">
        <h2>Why Choose Global Currency Converter</h2>
        <p>
          We provide accurate and real-time exchange rates for all your
          international transactions. Our platform is fast, reliable, and easy
          to use.
        </p>
      </section>
    </div>
  );
}
