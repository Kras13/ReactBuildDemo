import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CarForm from "./CarForm";

const CreateCar: React.FC = () => {
  const handleCreateSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/api/car/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create car");
      }

      alert("Car created successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  return (
    <div>
      <CarForm mode="create" carData={null} onSubmit={handleCreateSubmit} />
    </div>
  );
};

export default CreateCar;
