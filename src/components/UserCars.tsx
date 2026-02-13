import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import carPlaceholder from "../assets/carPlaceholder.png";

interface Car {
  id: number;
  title: string;
  price: number;
  yearManufactured: number;
  fuel: string;
  kilometers: number;
  image?: string;
}

function UserCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`http://localhost:8080/api/user/cars`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cars: " + response.text);
      }

      const data: Car[] = await response.json();

      setCars(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async () => {
    if (!selectedCar) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/api/car/delete/${selectedCar.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      setCars((prevCars) =>
        prevCars.filter((car) => car.id !== selectedCar.id)
      );

      setSelectedCar(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (car: Car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCar(null);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2>Car Catalog</h2>

      <div className="row" style={{ marginTop: "80px" }}>
        {cars.map((car) => (
          <div key={car.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                className="card-img-top"
                src={car.image || carPlaceholder}
                alt={`Image of ${car.title}`}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {car.title} - {car.price} lv.
                </h5>
                <p className="card-text">
                  {car.yearManufactured}, {car.fuel}, {car.kilometers} KM
                </p>
                <Link to={`/edit/car/${car.id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => openModal(car)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete the car "{selectedCar?.title}"?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserCars;
