"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../../../../lib/supabaseClient';

interface MarqueeItem {
  id: number;
  content: string;
  is_active: boolean;
  display_order: number;
}

const MarqueeTab = () => {
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState(0);
  const [isNewActive, setIsNewActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);

  // Fetch marquee items
  const fetchMarqueeItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marquee_content')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMarqueeItems(data || []);
    } catch (error) {
      console.error('Error fetching marquee items:', error);
      toast.error('Failed to fetch marquee items');
    }
  };

  useEffect(() => {
    fetchMarqueeItems();
  }, []);

  // Add new marquee item
  const handleAdd = async () => {
    if (!newContent.trim()) {
      toast.error('Please enter content');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('marquee_content')
        .insert([{
          content: newContent.trim(),
          is_active: isNewActive,
          display_order: newDisplayOrder,
        }]);

      if (error) throw error;

      toast.success('Marquee item added successfully');
      setNewContent('');
      setNewDisplayOrder(0);
      setIsNewActive(true);
      fetchMarqueeItems();
    } catch (error) {
      console.error('Error adding marquee item:', error);
      toast.error('Failed to add marquee item');
    } finally {
      setLoading(false);
    }
  };

  // Update marquee item
  const handleUpdate = async (id: number) => {
    if (!editContent.trim()) {
      toast.error('Please enter content');
      return;
    }

    try {
      const { error } = await supabase
        .from('marquee_content')
        .update({
          content: editContent.trim(),
          is_active: editIsActive,
          display_order: editDisplayOrder,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Marquee item updated successfully');
      setEditingId(null);
      setEditContent('');
      setEditDisplayOrder(0);
      setEditIsActive(true);
      fetchMarqueeItems();
    } catch (error) {
      console.error('Error updating marquee item:', error);
      toast.error('Failed to update marquee item');
    }
  };

  // Delete marquee item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this marquee item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('marquee_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Marquee item deleted successfully');
      fetchMarqueeItems();
    } catch (error) {
      console.error('Error deleting marquee item:', error);
      toast.error('Failed to delete marquee item');
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('marquee_content')
        .update({
          is_active: !currentStatus,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status updated successfully');
      fetchMarqueeItems();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Start editing
  const startEditing = (item: MarqueeItem) => {
    setEditingId(item.id);
    setEditContent(item.content);
    setEditDisplayOrder(item.display_order);
    setEditIsActive(item.is_active);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
    setEditDisplayOrder(0);
    setEditIsActive(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add New Marquee Item */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Marquee Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter marquee content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={newDisplayOrder}
              onChange={(e) => setNewDisplayOrder(Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isNewActive}
                onChange={(e) => setIsNewActive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Marquee Item'}
        </button>
      </div>

      {/* Manage Existing Marquee Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Marquee Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marqueeItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.content}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editDisplayOrder}
                        onChange={(e) => setEditDisplayOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{item.display_order}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === item.id ? (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editIsActive}
                          onChange={(e) => setEditIsActive(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(item.id, item.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {marqueeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No marquee items found. Add some content to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default MarqueeTab; 