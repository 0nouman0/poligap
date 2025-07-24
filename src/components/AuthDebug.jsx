import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AuthDebug() {
  const { user, session, loading, signUp, signIn, signOut } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  const handleTestSignUp = async () => {
    console.log('Testing signup...');
    const result = await signUp(testEmail, testPassword, {
      first_name: 'Test',
      last_name: 'User'
    });
    console.log('Signup result:', result);
  };

  const handleTestSignIn = async () => {
    console.log('Testing signin...');
    const result = await signIn(testEmail, testPassword);
    console.log('Signin result:', result);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md">
      <h3 className="font-bold mb-2">Auth Debug Panel</h3>
      
      <div className="text-sm mb-2">
        <strong>Status:</strong> {loading ? 'Loading...' : user ? 'Signed In' : 'Signed Out'}
      </div>
      
      {user && (
        <div className="text-xs mb-2 p-2 bg-green-50 rounded">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
        </div>
      )}

      <div className="space-y-2">
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="Test email"
          className="w-full p-1 border rounded text-xs"
        />
        <input
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          placeholder="Test password"
          className="w-full p-1 border rounded text-xs"
        />
        
        <div className="flex gap-1">
          <button 
            onClick={handleTestSignUp}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Test Signup
          </button>
          <button 
            onClick={handleTestSignIn}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            Test Login
          </button>
          {user && (
            <button 
              onClick={signOut}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthDebug;
