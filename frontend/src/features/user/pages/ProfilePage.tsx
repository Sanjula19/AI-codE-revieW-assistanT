import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { userApi, type UserProfile } from '../api/user'; 
import { Button } from '../../../components/ui/Button';
import { User, Mail, Calendar, Save, X, Edit2 } from 'lucide-react';

export const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ username: '', email: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);
      setFormData({ username: data.username, email: data.email });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await userApi.updateProfile(formData);
      // Handle response structure differences
      const updatedUser = (res as any).user || res; 
      setProfile(updatedUser); 
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err: any) {
       const errorMsg = err.response?.data?.message || 'Failed to update';
       setMessage({ type: 'error', text: errorMsg });
    }
  };

  if (loading) return <DashboardLayout>Loading Profile...</DashboardLayout>;
  
  // If profile is null, show a helpful message instead of crashing
  if (!profile) return (
      <DashboardLayout>
          <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-xl font-bold text-red-600 mb-2">Could not load profile</h2>
              <p className="text-gray-600 mb-4">Your session might have expired.</p>
              <Button onClick={() => window.location.href = '/login'}>
                  Go to Login
              </Button>
          </div>
      </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        {message && (
          <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
             <div className="absolute -bottom-10 left-8">
               <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                 <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                   <User className="w-10 h-10" />
                 </div>
               </div>
             </div>
          </div>

          <div className="pt-12 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile.username}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                  {profile.roles?.[0]?.replace('ROLE_', '') || 'USER'}
                </span>
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                     <p className="text-xs text-gray-500">Email Address</p>
                     <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};