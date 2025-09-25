"use client";

import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import AdminPageComponent from '../components/AdminPageComponent';
import type { AdminProfile } from '../admin_m/admin';

// Demo admin data - replace with actual data from your authentication system
const demoAdminData: AdminProfile = {
  id: "admin_123456789",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@university.edu",
  phoneNumber: "+1 (555) 123-4567",
  dateOfBirth: "1985-03-15",
  profilePhoto: undefined,
  role: "admin",
  permissions: ["read", "write", "delete", "manage_users", "manage_complaints", "view_analytics"],
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
  updatedAt: new Date().toISOString(),
  isActive: true,
  twoFactorEnabled: false
};

// API configuration for backend integration
const apiConfig = {
  baseUrl: 'http://localhost:5000/api', // Replace with your backend URL
  headers: {
    'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''}`,
    'X-Admin-Role': 'admin'
  },
  timeout: 15000
};

export default function AdminPage() {
  // Handle profile update
  const handleUpdateProfile = async (updatedProfile: Partial<typeof demoAdminData>) => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating admin profile:', updatedProfile);
      
      // Simulate API call
      const response = await fetch(`${apiConfig.baseUrl}/admin/profile/${demoAdminData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...apiConfig.headers
        },
        body: JSON.stringify(updatedProfile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await response.json();
      return { ...demoAdminData, ...updatedProfile, updatedAt: new Date().toISOString() };
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw error;
    }
  };

  // Handle photo upload
  const handleUploadPhoto = async (file: File): Promise<string> => {
    try {
      // TODO: Replace with actual photo upload API call
      console.log('Uploading admin photo:', file.name);
      
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('adminId', demoAdminData.id);

      const response = await fetch(`${apiConfig.baseUrl}/admin/upload-photo`, {
        method: 'POST',
        headers: {
          ...apiConfig.headers
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      return data.photoUrl || URL.createObjectURL(file); // Fallback to local URL for demo
    } catch (error) {
      console.error('Error uploading admin photo:', error);
      // For demo purposes, return local URL
      return URL.createObjectURL(file);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    try {
      // Clear admin authentication
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      sessionStorage.clear();
      
      // TODO: Make API call to invalidate admin session
      fetch(`${apiConfig.baseUrl}/admin/logout`, {
        method: 'POST',
        headers: apiConfig.headers
      }).catch(console.error);
      
      // Redirect to admin login
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error during admin sign out:', error);
      // Force redirect even if API call fails
      window.location.href = '/admin/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Admin Content */}
      <main className="pt-16"> {/* Account for fixed navbar height */}
        <AdminPageComponent
          admin={demoAdminData}
          onUpdateProfile={handleUpdateProfile}
          onUploadPhoto={handleUploadPhoto}
          onSignOut={handleSignOut}
          apiConfig={apiConfig}
          className="min-h-screen"
        />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}