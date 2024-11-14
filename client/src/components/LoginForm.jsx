import React from 'react';

const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const loading = false;
  return (
    <form className="space-y-6">
      <div className="">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-6">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        disabled={loading}
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent 
					rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-pink-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
          }`}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};

export default LoginForm;
