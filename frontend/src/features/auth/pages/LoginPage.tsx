import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth'; // Import the hook

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth(); // Get the login function
  
  // State to store what user types
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page from refreshing
    setError('');

    try {
      // Call the backend
      // Note: We map 'email' to 'username' because your backend expects 'username'
      await login({ 
        username: formData.email, // using email as username for now? Check your backend! 
        password: formData.password 
      });
      
      // If successful, go to Dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {/* Show Error Message if login fails */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Input 
          label="Username"  // Changed from Email to Username to match your backend
          name="email"      // (Keep name as 'email' or 'username' depending on preference)
          value={formData.email}
          onChange={handleChange}
          type="text" 
          placeholder="Your username"
          required
        />

        <Input 
          label="Password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password" 
          placeholder="••••••••" 
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button 
          className="w-full" 
          type="submit" 
          isLoading={isLoading} // Show spinner while loading
        >
          Sign in
        </Button>

        {/* ... (Keep the Google button and Sign Up link) ... */}
         <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" type="button" className="w-full">
           {/* ... svg icons ... */}
           Google
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};