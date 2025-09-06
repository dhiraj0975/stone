import React, { useEffect, useState } from "react";
import { FiSave, FiX, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  createProduct,
  fetchProducts,
} from "../../redux/product/productThunks";
import { HideLoading, ShowLoading } from "../../redux/alertSlice";

const ProductionEntryForm = ({ onFormSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    product: {
      itemCode: "",
      name: "",
      type: "",
      unitOfMeasurement: "",
      description: "",
    },
    quantity: "",
    remarks: "",
  });

  const { products, error } = useSelector((state) => state.product);

  console.log(error);

  const data = products.data || [];

  const columns = [
    { name: "Item Code", selector: (row) => row.itemCode, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Type", selector: (row) => row.type, sortable: true },
    { name: "UOM", selector: (row) => row.unitOfMeasurement, sortable: true },
    {
      name: "HSN/SAC",
      selector: (row) => row.hsnSacCode || "N/A",
      sortable: true,
    },
    { name: "Tax Rate (%)", selector: (row) => row.taxRate, sortable: true },
    { name: "Description", selector: (row) => row.description },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
  ];
  // Search Filter
  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <div style={{ marginBottom: "10px" }}>
      <input
        type='text'
        placeholder='Search by name or code'
        value={filterText}
        onChange={onFilter}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={onClear}>Clear</button>
    </div>
  );

  // console.log(products.data, "JJJJ");

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterText, setFilterText] = useState("");

  const filteredItems = data.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponent = (
    <FilterComponent
      filterText={filterText}
      onFilter={(e) => setFilterText(e.target.value)}
      onClear={() => setFilterText("")}
    />
  );

  //!

  const productTypes = [
    "Raw Material",
    "Finished Good",
    "Fuel",
    "Equipment Part",
  ];
  const units = ["Kg", "Liters", "Pieces", "Meters", "Boxes"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.product.itemCode)
      newErrors.itemCode = "Item Code is required";
    if (!formData.product.name) newErrors.name = "Item Name is required";
    if (!formData.product.type) newErrors.type = "Item Type is required";
    if (!formData.product.unitOfMeasurement)
      newErrors.unitOfMeasurement = "UOM is required";
    // if (!formData.quantity) newErrors.quantity = "Quantity is required";

    setErrors(newErrors);

    try {
      dispatch(ShowLoading());
      if (Object.keys(newErrors).length === 0) {
        // console.log("Form Data Submitted:", formData);
        dispatch(createProduct(formData.product));
        if (onFormSubmit) {
          onFormSubmit(formData);
        }
        setShowForm(false);
        resetForm();
      }
      dispatch(fetchProducts());
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(HideLoading());
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      product: {
        itemCode: "",
        name: "",
        type: "",
        unitOfMeasurement: "",
        description: "",
      },
      quantity: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center'
      >
        <FiPlus className='mr-2' /> Add Production
      </button>

      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Production Entry
              </h2>
              <button
                onClick={handleCancel}
                className='text-gray-500 hover:text-gray-700'
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Production Order Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Date
                  </label>
                  <input
                    type='date'
                    name='date'
                    value={formData.date}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Item Code
                  </label>
                  <input
                    type='text'
                    name='itemCode'
                    value={formData.product.itemCode}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border ${
                      errors.itemCode ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.itemCode && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.itemCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Item Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.product.name}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
                  )}
                </div>
              </div>

              {/* More Product Details */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Item Type
                  </label>
                  <select
                    name='type'
                    value={formData.product.type}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value=''>Select Type</option>
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className='text-red-500 text-xs mt-1'>{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Unit of Measurement
                  </label>
                  <select
                    name='unitOfMeasurement'
                    value={formData.product.unitOfMeasurement}
                    onChange={handleProductChange}
                    className={`w-full px-3 py-2 border ${
                      errors.unitOfMeasurement
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value=''>Select UOM</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  {errors.unitOfMeasurement && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.unitOfMeasurement}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Quantity
                  </label>
                  <input
                    type='number'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.quantity ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  />
                  {errors.quantity && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.quantity}
                    </p>
                  )}
                </div> */}
              </div>

              {/* Description */}
              <div className='mb-8'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={formData.product.description}
                  onChange={handleProductChange}
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                />
              </div>

              {/* Remarks */}

              {/* Submit Buttons */}
              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={handleCancel}
                  className='px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 flex items-center'
                >
                  <FiX className='mr-2' /> Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'
                >
                  <FiSave className='mr-2' /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ padding: "20px" }}>
        <h2>Inventory Items</h2>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          striped
          subHeader
          subHeaderComponent={subHeaderComponent}
          persistTableHead
        />
      </div>
    </div>
  );
};

export default ProductionEntryForm;
