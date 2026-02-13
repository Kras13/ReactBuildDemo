import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import carPlaceholder from "../assets/carPlaceholder.png";

interface Brand {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
}

interface Feature {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Fuel {
  id: number;
  name: string;
}

interface Transmission {
  id: number;
  name: string;
}

interface Userinfo {
  firstName: String;
  lastName: String;
  phoneNumber: String;
}

interface CarDetailsData {
  brand: Brand;
  model: Model;
  title: string;
  description: string;
  price: number;
  dateManufactured: string;
  category: Category;
  fuel: Fuel;
  transmission: Transmission;
  features: Feature[];
  kilometers: number;
  user: Userinfo;
  image: string;
}

const CarDetails = () => {
  const { carId } = useParams<{ carId: string }>();
  const [carDetails, setCarDetails] = useState<CarDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/car/${carId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch car details.");
      }

      const data: CarDetailsData = await response.json();

      setCarDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(carId);

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  if (loading) {
    return <div>Loading car details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!carDetails) {
    return <div>No car details available.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Car Details</h2>
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{carDetails.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                Brand: {carDetails.brand.name}
              </h6>
              <h6 className="card-subtitle mb-2 text-muted">
                Model: {carDetails.model.name}
              </h6>
              <p className="card-text">
                <strong>Description:</strong> {carDetails.description}
              </p>
              <p className="card-text">
                <strong>Name:</strong> {carDetails.user.firstName}{" "}
                {carDetails.user.lastName}
              </p>
              <p className="card-text">
                <strong>Phone number:</strong> {carDetails.user.phoneNumber}
              </p>
              <p className="card-text">
                <strong>Price:</strong> {carDetails.price} lv.
              </p>
              <p className="card-text">
                <strong>Kilometers:</strong> {carDetails.kilometers}
              </p>
              <p className="card-text">
                <strong>Date manufactured:</strong>{" "}
                {carDetails.dateManufactured}
              </p>
              <p className="card-text">
                <strong>Category:</strong> {carDetails.category.name}
              </p>
              <p className="card-text">
                <strong>Fuel:</strong> {carDetails.fuel.name}
              </p>
              <p className="card-text">
                <strong>Transmission:</strong> {carDetails.transmission.name}
              </p>
              <div>
                <strong>Features:</strong>
                <ul>
                  {carDetails.features.map((feature) => (
                    <li key={feature.id}>{feature.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <img
            className="card-img"
            src={carDetails.image || carPlaceholder}
            alt={`Image of ${carDetails.title}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
