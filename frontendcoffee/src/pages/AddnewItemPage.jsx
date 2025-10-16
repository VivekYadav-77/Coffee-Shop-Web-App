import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
const AddProductForm = ({ onSave, onCancel, productToEdit, isLoading }) => {
  const backendaddress = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Coffee",
    roastLevel: "Medium",
    inStock: true,
    notes: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const categories = [
    "coffee",
    "tea",
    "snacks",
    "dessert",
    "shake",
    "cookie",
    "sandwich",
  ];
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        price: productToEdit.price || "",
        description: productToEdit.description || "",
        category: productToEdit.category || "Coffee",
        roastLevel: productToEdit.roastLevel || "Medium",
        inStock:
          productToEdit.inStock !== undefined ? productToEdit.inStock : true,
        notes: productToEdit.notes || "",
      });
      if (productToEdit.imageUrl) {
        setImagePreview(`${backendaddress}${productToEdit.imageUrl}`);
      }
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "coffee",
        roastLevel: "Medium",
        inStock: true,
        notes: "",
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    if (name === "category" && value !== "coffee") {
      newFormData.roastLevel = "";
    }
    setFormData(newFormData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });
    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    onSave(submissionData);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 p-3 rounded-xl transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Management</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center">
          {productToEdit ? "Edit Item" : "Add New Item"}
        </h1>
        <div className="w-40"></div> {/* Spacer */}
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-gray-800/50 border border-gray-700 rounded-2xl p-6 sm:p-8 space-y-8"
      >
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-700 pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g., Classic Espresso"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g., 120"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-400"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {formData.category === "coffee" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-400 mb-1">
                  Roast Level
                </label>
                <input
                  type="text"
                  name="roastLevel"
                  value={formData.roastLevel}
                  onChange={handleInputChange}
                  className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-400"
                  placeholder="e.g., Medium, Dark"
                />
              </div>
            )}

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Tasting Notes
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                placeholder="e.g., Chocolate, Caramel, Fruity"
              />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Image
          </h3>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              <Upload size={16} />
              {imagePreview ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Description
          </h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-yellow-400"
            placeholder="A short description for the menu card..."
          ></textarea>
        </div>

        {/* Final Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
            />
            <label htmlFor="inStock" className="text-gray-300">
              Item is in stock
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading
                ? "Saving..."
                : productToEdit
                ? "Save Changes"
                : "Add Item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddProductForm;
