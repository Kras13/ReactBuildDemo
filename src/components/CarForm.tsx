import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";

interface CarFormProps {
  mode: "create" | "edit";
  carData?: any;
  onSubmit: (data: any) => Promise<void>;
}

interface CarFeature {
  id: number;
}

const CarForm = ({ mode, carData, onSubmit }: CarFormProps) => {
  const [formData, setFormData] = useState({
    id: carData?.id || "",
    modelId: carData?.model.id || "",
    title: carData?.title || "",
    description: carData?.description || "",
    price: carData?.price || "",
    kilometers: carData?.kilometers || "",
    dateManufactured: carData?.dateManufactured || "",
    categoryId: carData?.category.id || "",
    fuelId: carData?.fuel.id || "",
    transmissionId: carData?.transmission.id || "",
    features:
      carData?.features?.map((feature: { id: number }) => feature.id) || [],
    image: carData?.image || "",
  });

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(carData?.brand.id || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [brandRes, transmissionRes, fuelRes, categoryRes, featureRes] =
        await Promise.all([
          fetch("http://localhost:8080/api/brand/fetch"),
          fetch("http://localhost:8080/api/transmission/fetch"),
          fetch("http://localhost:8080/api/fuel/fetch"),
          fetch("http://localhost:8080/api/category/fetch"),
          fetch("http://localhost:8080/api/feature/fetch"),
        ]);

      setBrands(await brandRes.json());
      setTransmissions(await transmissionRes.json());
      setFuels(await fuelRes.json());
      setCategories(await categoryRes.json());
      setFeatures(await featureRes.json());

      if (selectedBrand) {
        fetchModels(selectedBrand);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const fetchModels = async (brandId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/model/${brandId}`
      );
      setModels(await response.json());
    } catch (error) {
      console.error("Failed to fetch models", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "brandId") {
      setSelectedBrand(value);
      fetchModels(value);

      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (selectedValues: any) => {
    setFormData((prev) => ({ ...prev, features: selectedValues }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await onSubmit(formData);

      if (mode === "create") {
        setFormData({
          id: "",
          modelId: "",
          title: "",
          description: "",
          price: "",
          kilometers: "",
          dateManufactured: "",
          categoryId: "",
          fuelId: "",
          transmissionId: "",
          features: [],
          image: "",
        });
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{mode === "create" ? "Create Car" : "Edit Car"}</h2>
      {message && (
        <div
          className={`alert ${
            message.includes("successfully") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="col-md-6 mb-3">
          <label>Brand</label>
          <select
            className="form-select"
            name="brandId"
            value={selectedBrand}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand: any) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label>Model</label>
          <select
            className="form-select"
            name="modelId"
            value={formData.modelId}
            onChange={handleInputChange}
          >
            <option value="-1"></option>
            {models.map((model: any) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mt-3">
          <label>Category</label>
          <select
            className="form-select"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
          >
            <option value="-1"></option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mt-3">
          <label>Fuel</label>
          <select
            className="form-select"
            name="fuelId"
            value={formData.fuelId}
            onChange={handleInputChange}
          >
            <option value="-1"></option>
            {fuels.map((fuel: any) => (
              <option key={fuel.id} value={fuel.id}>
                {fuel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mt-3">
          <label>Transmission</label>
          <select
            className="form-select"
            name="transmissionId"
            value={formData.transmissionId}
            onChange={handleInputChange}
          >
            <option value="-1"></option>
            {transmissions.map((transmission: any) => (
              <option key={transmission.id} value={transmission.id}>
                {transmission.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="features" className="form-label">
            Features
          </label>
          <MultiSelect
            value={formData.features}
            options={features.map((feature: any) => ({
              label: feature.name,
              value: feature.id,
            }))}
            onChange={(e) => handleFeatureChange(e.value)}
            placeholder="Select features"
            className="form-control"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="price" className="form-label">
            Kilometers
          </label>
          <input
            type="number"
            className="form-control"
            id="kilometers"
            name="kilometers"
            value={formData.kilometers}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="dateManufactured" className="form-label">
            Date Manufactured
          </label>
          <input
            type="date"
            className="form-control"
            id="dateManufactured"
            name="dateManufactured"
            value={formData.dateManufactured}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="image" className="form-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Car"
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default CarForm;
