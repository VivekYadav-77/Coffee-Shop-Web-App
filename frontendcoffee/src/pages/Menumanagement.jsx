import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { adminApi } from "../utils/api.js";
import {
  updateMenuItemState,
  removeMenuItem,
} from "../redux/slices/menuSlice.js";
import AddProductForm from "./AddnewItemPage";
import { Plus, Edit, Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";

const MenuManagement = () => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menu.items || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");
  const [productToEdit, setProductToEdit] = useState(null);

  const backendaddress = import.meta.env.VITE_API_URL;

  const handleSave = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (productToEdit) {
        console.log("FormData contents form the edit one :");
        for (let [key, value] of formData.entries()) {
          console.log(key, ":", value);
        }
        const updatedItem = await adminApi.update(productToEdit._id, formData);
        console.log("updateitem", updatedItem);
      } else {
        const newItem = await adminApi.create(formData);
        console.log("adding new item", newItem);
      }
      setView("list");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsLoading(true);
      setError(null);
      try {
        await adminApi.delete(productId);
        dispatch(removeMenuItem(productId));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleAvailability = async (product) => {
    const updatedData = { ...product, inStock: !product.inStock };
    setIsLoading(true);
    setError(null);
    try {
      console.log("userData", updatedData);
      const updatedItem = await adminApi.toggleStock(product._id);
      dispatch(updateMenuItemState(updatedItem));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "form") {
    return (
      <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AddProductForm
            onSave={handleSave}
            onCancel={() => setView("list")}
            productToEdit={productToEdit}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <NavLink to="/">Back</NavLink>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Menu Management
          </h1>
          <button
            onClick={() => {
              setProductToEdit(null);
              setView("form");
            }}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add New Coffee</span>
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-white py-4">Loading...</div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center gap-3 mb-6">
            <AlertTriangle size={20} />
            <span>An error occurred: {error}</span>
          </div>
        )}

        <div
          className={`space-y-3 transition-opacity duration-300 ${
            isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <h3 className="text-white/80 text-xl font-semibold mt-8 mb-4">
            All Menu Items
          </h3>
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="emp-row h-24 w-3/4 border-4 border-dashed border-blue-500 rounded-lg p-4 flex flex-row justify-evenly items-center"
            >
              <div className="flex items-center gap-4 flex-grow">
                <img
                  src={`${backendaddress}${item.imageUrl}`}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                />
                <div className="emp-row-main">
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="muted">
                    {item.category} • ₹{item.price}
                  </p>
                </div>
              </div>
              <div className="emp-row-actions">
                <span
                  className={`badge ${
                    item.inStock
                      ? "bg-green-500/20 border-green-500/30 text-green-400"
                      : "bg-red-500/20 border-red-500/30 text-red-400"
                  }`}
                >
                  {item.inStock ? "Available" : "Unavailable"}
                </span>
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  title={item.inStock ? "Make unavailable" : "Make available"}
                >
                  {item.inStock ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => {
                    setProductToEdit(item);
                    setView("form");
                  }}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors"
                  title="Edit Item"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
