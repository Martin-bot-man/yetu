import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchInventoryItems, 
    fetchInventoryOverview,
    addInventoryItem, 
    updateStock,
    fetchSuppliers,
    fetchReorderSuggestions,
    fetchWasteAnalysis,
    selectInventoryItems,
    selectLowStockItems,
    selectSuppliers,
    selectReorderSuggestions,
    selectWasteAnalysis,
    selectInventoryOverview,
    selectInventoryLoading
} from "../redux/slices/inventorySlice";
import { enqueueSnackbar } from "notistack";
import { MdInventory, MdAddCircle, MdRefresh, MdWarning, MdAnalytics } from "react-icons/md";
import { FaTruck, FaChartLine, FaRecycle } from "react-icons/fa";

const Inventory = () => {
    const dispatch = useDispatch();
    
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddItem, setShowAddItem] = useState(false);
    
    // Inventory State
    const items = useSelector(selectInventoryItems);
    const lowStockItems = useSelector(selectLowStockItems);
    const suppliers = useSelector(selectSuppliers);
    const reorderSuggestions = useSelector(selectReorderSuggestions);
    const wasteAnalysis = useSelector(selectWasteAnalysis);
    const overview = useSelector(selectInventoryOverview);
    const loading = useSelector(selectInventoryLoading);

    useEffect(() => {
        document.title = "POS | Inventory Management";
        dispatch(fetchInventoryItems());
        dispatch(fetchInventoryOverview());
        dispatch(fetchSuppliers());
        dispatch(fetchReorderSuggestions());
        dispatch(fetchWasteAnalysis());
    }, [dispatch]);

    // Dashboard Stats
    const totalItems = overview.totalItems || items.length;
    const totalValue = overview.totalStockValue || items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);
    const lowStockCount = overview.lowStock || lowStockItems.length;
    const wasteCost = overview.totalWasteCost || wasteAnalysis.totalWasteCost || 0;
    const outOfStockCount = overview.outOfStock || 0;

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: MdAnalytics },
        { id: 'items', name: 'Inventory Items', icon: MdInventory },
        { id: 'suppliers', name: 'Suppliers', icon: FaTruck },
        { id: 'analytics', name: 'Analytics', icon: FaChartLine },
        { id: 'waste', name: 'Waste Management', icon: FaRecycle }
    ];

    return (
        <div className="bg-[#1f1f1f] min-h-screen">
            {/* Header */}
            <div className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-[#f5f5f5]">Inventory Management</h1>
                        <span className="px-3 py-1 bg-yellow-500 text-black text-sm font-semibold rounded-full">
                            AI-Powered
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => {
                                dispatch(fetchInventoryItems());
                                dispatch(fetchInventoryOverview());
                                dispatch(fetchReorderSuggestions());
                                enqueueSnackbar("Data refreshed", { variant: "success" });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] text-[#f5f5f5] rounded-lg hover:bg-[#3a3a3a] transition-colors"
                        >
                            <MdRefresh /> Refresh
                        </button>
                        <button 
                            onClick={() => setShowAddItem(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            <MdAddCircle /> Add Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[#2a2a2a]">
                <div className="flex px-6 py-3 space-x-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id 
                                    ? 'bg-yellow-500 text-black' 
                                    : 'text-[#ababab] hover:text-[#f5f5f5] hover:bg-[#2a2a2a]'
                            }`}
                        >
                            <tab.icon size={20} />
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'dashboard' && (
                    <DashboardView 
                        totalItems={totalItems}
                        totalValue={totalValue}
                        lowStockCount={lowStockCount}
                        wasteCost={wasteCost}
                        lowStockItems={lowStockItems}
                        reorderSuggestions={reorderSuggestions}
                        outOfStockCount={outOfStockCount}
                        loading={loading}
                    />
                )}

                {activeTab === 'items' && (
                    <ItemsView 
                        items={items}
                        suppliers={suppliers}
                        onUpdateStock={(itemId, data) => dispatch(updateStock({ itemId, data }))}
                        loading={loading}
                    />
                )}

                {activeTab === 'suppliers' && (
                    <SuppliersView 
                        suppliers={suppliers}
                        loading={loading}
                    />
                )}

                {activeTab === 'analytics' && (
                    <AnalyticsView 
                        reorderSuggestions={reorderSuggestions}
                        wasteAnalysis={wasteAnalysis}
                        items={items}
                        loading={loading}
                    />
                )}

                {activeTab === 'waste' && (
                    <WasteView 
                        wasteAnalysis={wasteAnalysis}
                        loading={loading}
                    />
                )}
            </div>

            {/* Modals */}
            {showAddItem && (
                <AddItemModal 
                    onClose={() => setShowAddItem(false)}
                    onAdd={(data) => {
                        dispatch(addInventoryItem(data));
                        setShowAddItem(false);
                        enqueueSnackbar("Item added successfully", { variant: "success" });
                    }}
                    suppliers={suppliers}
                />
            )}
        </div>
    );
};

// Dashboard Component
const DashboardView = ({ totalItems, totalValue, lowStockCount, wasteCost, outOfStockCount, lowStockItems, reorderSuggestions, loading }) => (
    <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-5 gap-4">
            <MetricCard 
                title="Total Items" 
                value={totalItems} 
                icon={MdInventory}
                color="bg-blue-500"
            />
            <MetricCard 
                title="Total Value" 
                value={`KES ${totalValue.toLocaleString()}`} 
                icon={MdAnalytics}
                color="bg-green-500"
            />
            <MetricCard 
                title="Low Stock Items" 
                value={lowStockCount} 
                icon={MdWarning}
                color="bg-orange-500"
            />
            <MetricCard 
                title="Waste Cost" 
                value={`KES ${wasteCost.toLocaleString()}`} 
                icon={FaRecycle}
                color="bg-red-500"
            />
            <MetricCard 
                title="Out Of Stock" 
                value={outOfStockCount} 
                icon={MdWarning}
                color="bg-rose-600"
            />
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">Low Stock Alerts</h3>
                {lowStockItems.length > 0 ? (
                    <div className="space-y-3">
                        {lowStockItems.slice(0, 5).map((item) => (
                            <div key={item._id} className="flex justify-between items-center p-3 bg-[#2a2a2a] rounded">
                                <span className="text-[#f5f5f5]">{item.name}</span>
                                <span className="text-red-400 font-semibold">Stock: {item.currentStock}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#ababab]">No low stock items</p>
                )}
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">AI Reorder Suggestions</h3>
                {reorderSuggestions.length > 0 ? (
                    <div className="space-y-3">
                        {reorderSuggestions.slice(0, 5).map((suggestion, index) => (
                            <div key={index} className="p-3 bg-[#2a2a2a] rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[#f5f5f5] font-medium">{suggestion.item.name}</span>
                                        <p className="text-sm text-[#ababab]">{suggestion.suggestion.type}</p>
                                    </div>
                                    <span className="text-yellow-400 font-semibold">{suggestion.suggestion.quantity} units</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#ababab]">No reorder suggestions available</p>
                )}
            </div>
        </div>
    </div>
);

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-[#ababab]">{title}</p>
                <p className="text-2xl font-bold text-[#f5f5f5] mt-1">{value}</p>
            </div>
            <div className={`${color} p-3 rounded-full`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

// Items View Component
const ItemsView = ({ items, suppliers, onUpdateStock, loading }) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#f5f5f5]">Inventory Items</h3>
            <span className="text-sm text-[#ababab]">{items.length} items</span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-[#ababab] border-b border-[#2a2a2a]">
                        <th className="pb-3">Item</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Stock</th>
                        <th className="pb-3">Unit Price</th>
                        <th className="pb-3">Supplier</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item._id} className="border-b border-[#2a2a2a]">
                            <td className="py-3">
                                <div>
                                    <p className="text-[#f5f5f5] font-medium">{item.name}</p>
                                    <p className="text-sm text-[#ababab]">{item.unit}</p>
                                </div>
                            </td>
                            <td className="py-3">
                                <span className="px-2 py-1 bg-[#2a2a2a] text-xs rounded">{item.category}</span>
                            </td>
                            <td className="py-3">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        item.currentStock <= item.reorderLevel ? 'bg-red-500/20 text-red-400' :
                                        item.currentStock <= item.minStock ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-green-500/20 text-green-400'
                                    }`}>
                                        {item.currentStock}
                                    </span>
                                    <span className="text-xs text-[#ababab]">/{item.maxStock}</span>
                                </div>
                            </td>
                            <td className="py-3 text-[#f5f5f5]">KES {item.costPrice}</td>
                            <td className="py-3 text-[#f5f5f5]">{item.supplier?.name || 'N/A'}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    item.currentStock <= item.reorderLevel ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                    {item.currentStock <= item.reorderLevel ? 'Urgent' : 'Normal'}
                                </span>
                            </td>
                            <td className="py-3">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onUpdateStock(item._id, { quantity: 1, type: 'add' })}
                                        className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                                    >
                                        +1
                                    </button>
                                    <button 
                                        onClick={() => onUpdateStock(item._id, { quantity: 1, type: 'remove', reason: 'Preparation Waste' })}
                                        className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                                    >
                                        -1
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// Add Item Modal
const AddItemModal = ({ onClose, onAdd, suppliers }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Proteins',
        unit: 'kg',
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        costPrice: 0,
        sellingPrice: 0,
        supplier: '',
        location: 'Dry Store',
        isPerishable: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">Add New Inventory Item</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 bg-[#2a2a2a] rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-3 bg-[#2a2a2a] rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        {['Proteins', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy', 'Beverages', 'Packaging', 'Cleaning', 'Other'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Current Stock"
                            value={formData.currentStock}
                            onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value)})}
                            className="w-full p-3 bg-[#2a2a2a] rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="number"
                            placeholder="Cost Price (KES)"
                            value={formData.costPrice}
                            onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                            className="w-full p-3 bg-[#2a2a2a] rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-[#f5f5f5]">
                            <input
                                type="checkbox"
                                checked={formData.isPerishable}
                                onChange={(e) => setFormData({...formData, isPerishable: e.target.checked})}
                            />
                            Perishable
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-400">
                            Add Item
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-[#2a2a2a] text-[#f5f5f5] py-3 rounded-lg hover:bg-[#3a3a3a]">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Placeholder components for other tabs
const SuppliersView = ({ suppliers, loading }) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">Suppliers</h3>
        <p className="text-[#ababab]">Supplier management interface coming soon...</p>
    </div>
);

const AnalyticsView = ({ reorderSuggestions, wasteAnalysis, items, loading }) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">Analytics & Insights</h3>
        <p className="text-[#ababab]">Advanced analytics dashboard coming soon...</p>
    </div>
);

const WasteView = ({ wasteAnalysis, loading }) => (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4">Waste Management</h3>
        <p className="text-[#ababab]">Waste tracking and analysis coming soon...</p>
    </div>
);

export default Inventory;
