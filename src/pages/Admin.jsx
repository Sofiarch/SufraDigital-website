import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminPanel from '../components/AdminPanel'; 

const Admin = () => {
  const [session, setSession] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 1. Check Login Status & Fetch Restaurant
  useEffect(() => {
    // A. On Mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRestaurant(session.user.id);
      else setLoading(false);
    });

    // B. On Auth Change (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setLoading(true);
        fetchRestaurant(session.user.id);
      } else {
        setRestaurant(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Restaurant by OWNER_ID (The Secure Way)
  async function fetchRestaurant(userId) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', userId) // <--- This checks the ID we just added in SQL
        .single();

      if (error) {
         console.warn("No restaurant found for this user.");
         setRestaurant(null);
      } else {
         setRestaurant(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 3. Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
        setLoginError('❌ ' + error.message);
        setLoading(false);
    }
    // Note: No need to call fetchRestaurant here manually; 
    // onAuthStateChange above will trigger automatically when login succeeds.
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f4f4] text-gray-500 font-bold">Loading...</div>;

  // SCENE 1: NOT LOGGED IN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold text-center mb-6 text-[#3c3728]">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full p-3 border rounded-xl outline-none focus:border-[#EAC8CA] focus:ring-1 focus:ring-[#EAC8CA] transition-all" 
                  required 
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full p-3 border rounded-xl outline-none focus:border-[#EAC8CA] focus:ring-1 focus:ring-[#EAC8CA] transition-all" 
                  required 
                />
            </div>
            {loginError && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold text-center">{loginError}</div>}
            <button className="w-full bg-[#3c3728] text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // SCENE 2: LOGGED IN BUT NO RESTAURANT LINKED
  if (!restaurant) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">No Restaurant Linked</h2>
        <p className="text-gray-500 max-w-md">
          This account (<strong>{session.user.email}</strong>) is not linked to any restaurant in the database.
        </p>
        <div className="mt-6 flex gap-4">
          <button onClick={handleLogout} className="px-6 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50">Sign Out</button>
        </div>
      </div>
    );
  }

  // SCENE 3: LOGGED IN & RESTAURANT FOUND -> SHOW PANEL
  return <AdminPanel restaurant={restaurant} onLogout={handleLogout} />;
};

export default Admin;