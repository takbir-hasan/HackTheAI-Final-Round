"use client";

import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import ProfilePageComponent from '../components/ProfilePageComponent';

// Interface for user profile data
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  profilePhoto?: string;
}

// Demo user data - replace with actual user data from your backend
const demoUser: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@university.edu',
  phoneNumber: '+1 (555) 123-4567',
  dateOfBirth: '1990-05-15',
  profilePhoto: undefined // Will use placeholder
};

// Interface for security form data
interface SecurityFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ProfilePage() {
  // Handle profile update
  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    try {
      // Here you would make an API call to update the profile
      console.log('Updating profile:', updatedProfile);
      
      // Example API call:
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(updatedProfile)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update profile');
      // }
      
      // Success feedback
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  // Handle photo upload
  const handleUploadPhoto = async (file: File) => {
    try {
      // Here you would upload the photo to your backend
      console.log('Uploading photo:', file);
      
      // Example API call:
      // const formData = new FormData();
      // formData.append('photo', file);
      
      // const response = await fetch('/api/user/upload-photo', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to upload photo');
      // }
      
      // Success feedback
      console.log('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new Error('Failed to upload photo');
    }
  };

  // Handle password change
  const handleChangePassword = async (passwords: SecurityFormData) => {
    try {
      // Here you would make an API call to change the password
      console.log('Changing password:', { 
        oldPassword: '***hidden***', 
        newPassword: '***hidden***' 
      });
      
      // Example API call:
      // const response = await fetch('/api/user/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     oldPassword: passwords.oldPassword,
      //     newPassword: passwords.newPassword
      //   })
      // });
      
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Failed to change password');
      // }
      
      // Success feedback
      console.log('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Failed to change password');
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home page or login
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Profile Content */}
      <main className="pt-20"> {/* Add top padding to account for fixed navbar */}
        <ProfilePageComponent
          user={demoUser}
          onUpdateProfile={handleUpdateProfile}
          onUploadPhoto={handleUploadPhoto}
          onChangePassword={handleChangePassword}
          onSignOut={handleSignOut}
        />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}