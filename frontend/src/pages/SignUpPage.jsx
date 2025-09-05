// File: src/pages/SignUpPage.jsx
import { useState, useRef } from 'react';
import {
  MessageSquare,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthImagePattern from './AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';

const SignUpPage = () => {
  
  const navigate = useNavigate();
  const { signUp, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.dismiss();
      toast.error('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.dismiss();
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.dismiss();
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.password) {
      toast.dismiss();
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.dismiss();
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success= validateForm();
    if(success===true)signUp(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-100 text-base-content">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-base-content">Create Account</h1>
            <p className="text-base-content/60">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  ref={fullNameRef}
                  type="text"
                  name="fullName"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, emailRef)}
                  className="input input-bordered w-full pl-10 bg-base-200 text-base-content placeholder:text-base-content/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                  <Mail className="size-5 text-base-content/50" />
                </div>
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                  className="input input-bordered w-full pl-10 bg-base-200 text-base-content placeholder:text-base-content/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10 pr-10 bg-base-200 text-base-contentplaceholder:text-base-content"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Join our community!"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;

