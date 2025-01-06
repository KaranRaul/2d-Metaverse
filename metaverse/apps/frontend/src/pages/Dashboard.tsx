import React, { useEffect, useState } from 'react';
import CreateSpaceModal from '../components/CreateSpaceModal';
import { getAllSpaces } from '../api/space';
import { useNavigate } from 'react-router-dom';

interface Space {
    id: string;
    name: string;
    thumbnail?: string;
    dimensions: string;
}

const Dashboard = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
    const [spaceCreatedMessage, setSpaceCreatedMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const getMyExistingSpaces = async () => {
        const response = await getAllSpaces();
        setSpaces(response);
    };

    useEffect(() => {
        getMyExistingSpaces();
    }, [spaceCreatedMessage]);

    const handleSpaceCreated = () => {
        setSpaceCreatedMessage('Space created successfully!');

        setTimeout(() => {
            setSpaceCreatedMessage(null);
        }, 3000);
    };


    const handleOpenSpace = (spaceId: string, dimensions: string) => {
        const width = dimensions.split('x')[0];
        const height = dimensions.split('x')[1];
        navigate(`/game?spaceId=${spaceId}&width=${width}&height=${height}`);
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-12">
            {/* Success message */}
            {spaceCreatedMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                    {spaceCreatedMessage}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-5xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Metaverse Game</h1>
                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                        onClick={() => setIsCreateSpaceOpen(true)}
                    >
                        Create a Space
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-all duration-300">
                        Join a Space
                    </button>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Previous Spaces</h2>
                    <div className="flex flex-col space-y-4">
                        {spaces.map((space) => (
                            <div
                                key={space.id}
                                className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex items-center p-4"
                            >
                                {space.thumbnail ? (
                                    <img
                                        src={space.thumbnail}
                                        alt={space.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-600 text-sm rounded-md mr-4">
                                        No Image
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 truncate">{space.name}</h3>
                                    <p className="text-gray-500 text-sm">Dimensions: {space.dimensions}</p>
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                                    onClick={() => handleOpenSpace(space.id, space.dimensions)}>
                                    Start Space
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {
                isCreateSpaceOpen && (
                    <CreateSpaceModal
                        setIsCreateSpaceOpen={setIsCreateSpaceOpen}
                        onSpaceCreated={handleSpaceCreated}
                    />
                )
            }
        </div >
    );
};

export default Dashboard;
