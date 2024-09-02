import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null); // Clear any previous errors
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // Handle non-200 responses
        setErrors(data.message || 'An error occurred. Please try again.');
        return;
      }

      console.log(data); // Log success response

      // Redirect or show success message as needed

    } catch (error) {
      setLoading(false);
      setErrors(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          type='text' 
          name='username' 
          placeholder='username' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <input 
          type='email' 
          name='email' 
          placeholder='email' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <input 
          type='password' 
          name='password' 
          placeholder='password' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <button 
          disabled={loading} 
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>    
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {errors && <p className='text-red-500 mt-5'>{errors}</p>}
    </div>
  );
}
