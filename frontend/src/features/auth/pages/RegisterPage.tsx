import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export const RegisterPage = () => {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Start analyzing your code today"
    >
      <form className="space-y-6">
        {/* Full Name */}
        <Input 
          label="Full Name" 
          type="text" 
          placeholder="John Doe" 
        />

        {/* Email */}
        <Input 
          label="Email address" 
          type="email" 
          placeholder="you@example.com" 
        />

        {/* Password */}
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
        />

        {/* Confirm Password */}
        <Input 
          label="Confirm Password" 
          type="password" 
          placeholder="••••••••" 
        />

        {/* Terms Checkbox */}
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
          </label>
        </div>

        {/* Submit Button */}
        <Button className="w-full">
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