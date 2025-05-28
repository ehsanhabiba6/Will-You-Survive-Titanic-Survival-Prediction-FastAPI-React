import React, { useState } from "react";
import axios from 'axios';
import "./App.css"; // Styling moved here

function App() {
  const [formData, setFormData] = useState({
    Pclass: 3,
    Sex: "male",
    Age: 22,
    Parch: 0,
    Fare: 7.25,
    Embarked: "S",
    Title: "Mr",
    FamilySize: 1,
    is_alone: '',
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["Pclass", "Age", "Parch", "Fare", "FamilySize"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      const result = response.data.prediction;
      console.log(result);
      
      setPredictionResult(result);     // store result
      setShowModal(true);              // show modal
      
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  };



  return (
    <div className="app-container">
      <div className="form-box animate-fadein">
        <h2 className="heading">🚢 Titanic Survival Prediction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pclass:</label>
            <select name="Pclass" value={formData.Pclass} onChange={handleChange}>
              <option value={1}>1st Class</option>
              <option value={2}>2nd Class</option>
              <option value={3}>3rd Class</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sex:</label>
            <select name="Sex" value={formData.Sex} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Parch:</label>
            <input type="number" name="Parch" value={formData.Parch} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Fare:</label>
            <input type="number" name="Fare" value={formData.Fare} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Embarked:</label>
            <select name="Embarked" value={formData.Embarked} onChange={handleChange}>
              <option value="S">Southampton</option>
              <option value="C">Cherbourg</option>
              <option value="Q">Queenstown</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title:</label>
            <select name="Title" value={formData.Title} onChange={handleChange}>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Master">Master</option>
              <option value="Rare">Rare</option>
            </select>
          </div>

          <div className="form-group">
            <label>Family Size:</label>
            <input
              type="number"
              name="FamilySize"
              value={formData.FamilySize}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="is_alone">Is Alone</label>
            <select
              id="is_alone"
              name="is_alone"
              value={formData.is_alone}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="0">0 - Not Alone</option>
              <option value="1">1 - Alone</option>
            </select>
          </div>


          <button type="submit" className="btn">Predict</button>
        </form>

       {showModal && (
  <div
    style={{
      position: "fixed",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      color:"black",
      padding: "2rem 10rem 2rem 10rem",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
    }}
  >
    <h2 style={{padding:"1rem 4rem 1rem 4rem",fontSize:"2rem", backgroundColor:"lightblue"}}>Prediction Result</h2>
    <p style={{padding:"1rem",fontSize:"1.5rem"}}>{predictionResult === 1 ? "😀 The person survived!" : "😢 The person did not survive."}</p>
    <button class='close' onClick={() => setShowModal(false)}>Close</button>
  </div>
)}


      </div>
    </div>
  );
}

export default App;
