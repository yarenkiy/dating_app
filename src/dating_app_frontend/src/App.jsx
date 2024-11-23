// App.jsx

import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/dating_app_backend';

const App = () => {
  const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    initAuth();

  }, []);

  useEffect( async()  =>  {
    let result = await dating_app_backend.getMessages();
    setMessages(result);
    
  }, []);

  const initAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    if (await client.isAuthenticated()) {
      handleAuthenticated(client);
    }
  };

  const handleAuthenticated = async (client) => {
    const agent = new HttpAgent({
      host: "http://localhost:4943",
      identity: client.getIdentity(),
    });

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.CANISTER_ID,
    });

    setActor(actor);
    loadProfile();
  };

  const login = async () => {
    await authClient?.login({
      identityProvider: process.env.II_URL,
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const loadProfile = async () => {
    if (!actor) return;
    // Implement profile loading logic
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-semibold">Blockchain Dating</div>
            {!authClient?.isAuthenticated() ? (
              <button
                onClick={login}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Login with Internet Identity
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Profile and navigation items */}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {authClient?.isAuthenticated() ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
              {/* Profile content */}
            </div>

            {/* Matches Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Matches</h2>
              {/* Matches content */}
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              { messages}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Blockchain Dating
            </h2>
            <p className="text-gray-600 mb-8">
              Connect with your Internet Identity to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;