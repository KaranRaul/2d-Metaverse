import React, { useState } from 'react';
import CreateElement from '../components/CreateElement';
import CreateMap from '../components/CreateMap';

const AdminDashboard = () => {
    const [isElementCreateOpen, setIsElementCreateOpen] = useState<boolean>(false);
    const [isMapCreateOpen, setIsMapCreateOpen] = useState<boolean>(false);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Metaverse Game</h1>
                <div className="flex flex-col space-y-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setIsElementCreateOpen(true)}
                    >
                        Create Element
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setIsMapCreateOpen(true)}
                    >
                        Create Map
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                        Join a Space
                    </button>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Previous Spaces</h2>
                    {/* Previous spaces content */}
                </div>
            </div>
            {isElementCreateOpen && <CreateElement setIsElementCreateOpen={setIsElementCreateOpen} />}
            {isMapCreateOpen && <CreateMap setIsMapCreateOpen={setIsMapCreateOpen} />}
        </div>
    );
};

export default AdminDashboard;