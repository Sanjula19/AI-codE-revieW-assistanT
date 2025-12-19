import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // 2. Call Backend
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // 3. Redirect to Login on success
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      // Try to show the specific error from backend (e.g. "Username already in use")
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Start analyzing your code today"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Added Username Field (Required by Backend) */}
        <Input 
          label="Username" 
          name="username"
          value={formData.username}
          onChange={handleChange}
          type="text" 
          placeholder="johndoe123"
          required
        />

        <Input 
          label="Email address" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email" 
          placeholder="you@example.com"
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

        <Input 
          label="Confirm Password" 
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          type="password" 
          placeholder="••••••••"
          required 
        />

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required // Made this required
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          </label>
        </div>

        <Button className="w-full" type="submit" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};