import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MandateInvestorPage = () => {
  const { mandateId, investorId } = useParams();
  const [investorData, setInvestorData] = useState(null); 
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/mandates/${mandateId}/investor/${investorId}`);
        setInvestorData(response.data); // Updated this line
      } catch (error) {
        console.error('Could not fetch investor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorDetails();
  }, [mandateId, investorId]);

  const saveNotes = async () => {
    try {
      const response = await axios.patch(`http://localhost:3001/mandates/${mandateId}/investors/${investorId}/notes`, { notes });
      console.log('Notes added as an event');
  
      const newEvent = {
        timestamp: new Date(),
        eventType: 'Notes',
        notes,
        status: investorData.investorInMandate.mandateStatus,
      };
  
      const updatedEvents = [...investorData.investorInMandate.events, newEvent];
  
      // Update the local state
      setInvestorData({
        ...investorData,
        investorInMandate: {
          ...investorData.investorInMandate,
          events: updatedEvents,
        },
      });
  
      setNotes('');
  
    } catch (error) {
      console.error('Could not add notes', error);
    }
  };
  const updateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:3001/mandates/${mandateId}/investors/${investorId}/status`, { status: newStatus });
      console.log('Status updated:', response.data);
      
      // Update local state
      setInvestorData({
        ...investorData,
        investorInMandate: {
          ...investorData.investorInMandate,
          mandateStatus: newStatus,
        },
      });
    } catch (error) {
      console.error('Could not update status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!investorData) return <p>No such investor found within this mandate.</p>;

  const { investorDetails, investorInMandate } = investorData; // Assuming your API returns data in this structure

  return (
    <div className='container mt-3'>
      <section>
        <h2>{investorDetails.name}</h2>
        
          <select value={investorInMandate.mandateStatus} onChange={(e) => updateStatus(e.target.value)}>
            <option value="New">New</option>
            <option value="Due Diligence Stage">Due Diligence Stage</option>
            <option value="Termsheet Stage">Termsheet Stage</option>
            <option value="Investment Committee Call">Investment Committee Call</option>
            <option value="Partner Call">Partner Call</option>
            <option value="Team Call">Team Call</option>
            <option value="Responsed to Intro Email">Responsed to Intro Email</option>
            <option value="Pending to Respond">Pending to Respond</option>
            <option value="Pending to send Intro Email">Pending to send Intro Email</option>
            <option value="Rejected">Rejected</option>
          </select>
        
        <h4>Notes</h4>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          cols="50"
        />
        <button onClick={saveNotes}>Save Notes</button>
        <h4>Events</h4>
        <ul>
        {investorInMandate.events.reverse().map((event, idx) => (
            <li key={idx}>
            <i>{`${event.notes}`} <br /><small>{`${new Date(event.timestamp).toLocaleString()}`}</small></i>
            </li>
        ))}
        </ul>
      </section>

      {/* Investor Details */}
      <section>
        <h3>Investor Details</h3>
        <p>Name: {investorDetails.name}</p>
      <p>Email: {investorDetails.contactEmail}</p>
      <p>Phone: {investorDetails.contactPhone}</p>
      <p>Avg Investment Amount: {investorDetails.avgInvestmentAmount}</p>
      <p>Fund Size: {investorDetails.fundSize}</p>
      <p>Geographic Focus: {investorDetails.geographicFocus}</p>
      <p>Investment Stage: {investorDetails.investmentStage}</p>
      <p>Primary Contact Name: {investorDetails.primaryContactName}</p>
      <p>Primary Contact Position: {investorDetails.primaryContactPosition}</p>
      <p>Rating: {investorDetails.rating}</p>
      <p>Total Investments Made: {investorDetails.totalInvestmentsMade}</p>
      <p>Type: {investorDetails.type}</p>
      <p>Website: {investorDetails.website}</p>
      <p>Time to Decision: {investorDetails.timeToDecision}</p>
        <h4>Exit History</h4>
        <ul>
          {investorDetails.exitHistory.map((exit, idx) => (
            <li key={idx}>{exit}</li>
          ))}
        </ul>
        <h4>Invested Companies</h4>
      <ul>
        {investorDetails.investedCompanies.map((company, idx) => (
          <li key={idx}>{company}</li>
        ))}
      </ul>
      
      <h4>Industry Focus</h4>
      <ul>
        {investorDetails.industryFocus.map((industry, idx) => (
          <li key={idx}>{industry}</li>
        ))}
      </ul>
      
      <h4>Reviews</h4>
      <ul>
        {investorDetails.reviews.map((review, idx) => (
          <li key={idx}>{review}</li>
        ))}
      </ul>
      </section>
    </div>
  );
};

export default MandateInvestorPage;