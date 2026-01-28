import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminPanel from '../components/AdminPanel'; // Import the component we just made

const Admin = () => {
  const [session, setSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 1. Check Login Status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRestaurant(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRestaurant(session.user.id);
      else {
        setRestaurant(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Restaurant for this User
  async function fetchRestaurant(userId) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', userId) // Make sure you linked the user in Supabase!
        .single();

      if (error) {
         console.log("No restaurant linked to this user.");
      }
      setRestaurant(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 3. Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setLoginError('❌ ' + error.message);
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // SCENE 1: NOT LOGGED IN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-[#3c3728]">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-[#3c3728]" required />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-[#3c3728]" required />
            </div>
            {loginError && <div className="text-red-500 text-sm font-bold text-center">{loginError}</div>}
            <button className="w-full bg-[#3c3728] text-white py-3 rounded-xl font-bold hover:opacity-90">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // SCENE 2: LOGGED IN BUT NO RESTAURANT FOUND
  if (!restaurant) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-2">No Restaurant Found</h2>
        <p className="text-gray-500">This account is not linked to any restaurant in the database.</p>
        <button onClick={handleLogout} className="mt-4 text-red-500 underline">Sign Out</button>
      </div>
    );
  }

  // SCENE 3: LOGGED IN & RESTAURANT FOUND (Show Panel)
  return <AdminPanel restaurant={restaurant} onLogout={handleLogout} />;
};

export default Admin;