import React, { useState } from 'react';
import '../styles/Forms.css';

const AssignmentModal = ({ farmers, employees, onClose, onAssign }) => {
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFarmerToggle = (farmerId) => {
    setSelectedFarmers(prev => 
      prev.includes(farmerId)
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFarmers.length === farmers.length) {
      setSelectedFarmers([]);
    } else {
      setSelectedFarmers(farmers.map(f => f.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || selectedFarmers.length === 0) {
      alert('Please select an employee and at least one farmer');
      return;
    }

    setLoading(true);

    try {
      const selectedEmployeeData = employees.find(emp => emp.id === parseInt(selectedEmployee));
      const assignments = selectedFarmers.map(farmerId => {
        const farmer = farmers.find(f => f.id === farmerId);
        return {
          farmerId,
          employeeId: parseInt(selectedEmployee),
          employeeName: selectedEmployeeData.name,
          farmerName: farmer.name
        };
      });

      await onAssign(assignments);
    } catch (error) {
      console.error('Error assigning farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>Assign Farmers to Employee</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="assignment-section">
            <div className="section-header">
              <h3>Select Employee</h3>
            </div>
            <div className="form-group">
              <label htmlFor="employee">Employee *</label>
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.designation || 'Employee'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="assignment-section">
            <div className="section-header">
              <h3>Select Farmers</h3>
              <button 
                type="button" 
                className="btn-link"
                onClick={handleSelectAll}
              >
                {selectedFarmers.length === farmers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="farmers-list">
              {farmers.length === 0 ? (
                <p className="no-data">No unassigned farmers available</p>
              ) : (
                farmers.map(farmer => (
                  <div key={farmer.id} className="farmer-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFarmers.includes(farmer.id)}
                        onChange={() => handleFarmerToggle(farmer.id)}
                      />
                      <span className="checkmark"></span>
                      <div className="farmer-info">
                        <strong>{farmer.name}</strong>
                        <span>{farmer.phone}</span>
                        <span>{farmer.state}, {farmer.district}</span>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="assignment-summary">
            <div className="summary-item">
              <span>Selected Farmers:</span>
              <strong>{selectedFarmers.length}</strong>
            </div>
            <div className="summary-item">
              <span>Selected Employee:</span>
              <strong>
                {selectedEmployee ? employees.find(emp => emp.id === parseInt(selectedEmployee))?.name : 'None'}
              </strong>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || selectedFarmers.length === 0 || !selectedEmployee}
            >
              {loading ? 'Assigning...' : `Assign ${selectedFarmers.length} Farmer${selectedFarmers.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal; 