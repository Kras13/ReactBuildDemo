import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CarForm from "./CarForm";

const EditCar = () => {
  const { carId } = useParams<{ carId: string }>();
  const [carData, setCarData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:8080/api/car/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }

        const data = await response.json();

        setCarData(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleEditSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/api/car/edit/${carId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update car");
      }

      alert("Car updated successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  if (loading) {
    return <div>Loading car details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div>
      <CarForm mode="edit" carData={carData} onSubmit={handleEditSubmit} />
    </div>
  );
};

export default EditCar;
