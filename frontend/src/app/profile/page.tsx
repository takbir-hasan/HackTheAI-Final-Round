"use client";

import Navbar from "../components/navbar";
import ProfilePageComponent from "../components/ProfilePageComponent";
import Footer from "../components/Footer";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  profilePhoto?: string;
}

export default function ProfilePage() {
  // Demo user data - in a real app, this would come from authentication/API
  const demoUser: UserProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phoneNumber: '+1 (555) 123-4567',
    dateOfBirth: '1995-06-15',
    profilePhoto: undefined
  };

  const handleUpdateProfile = async (updatedProfile: UserProfile): Promise<void> => {
    try {
      // Here you would make an API call to update the user's profile
      console.log('Updating profile:', updatedProfile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful update
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  };

  const handleUploadPhoto = async (file: File): Promise<void> => {
    try {
      // Here you would upload the file to your server/cloud storage
      console.log('Uploading photo:', file.name, file.size);
      
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Photo uploaded successfully');
    } catch (error) {
      console.error('Failed to upload photo:', error);
      throw new Error('Failed to upload photo. Please try again.');
    }
  };

  const handleSignOut = (): void => {
    // Here you would handle the sign out logic
    console.log('Signing out user...');
    
    // Clear any stored authentication tokens
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Redirect to home page or login page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Add top margin to account for fixed navbar */}
      <div style={{ marginTop: '80px' }} className="flex-1">
        <ProfilePageComponent
          user={demoUser}
          onUpdateProfile={handleUpdateProfile}
          onUploadPhoto={handleUploadPhoto}
          onSignOut={handleSignOut}
        />
      </div>
      
      <Footer />
    </div>
  );
}