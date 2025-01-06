import React, { useEffect, useState } from 'react';
import { createSpace, getMaps } from '../api/space';

interface Map {
    id: string,
    name: string,
    thumbnail: string,
    height: number,
    width: number
}

export const CreateSpaceModal = ({
    setIsCreateSpaceOpen,
    onSpaceCreated
}: {
    setIsCreateSpaceOpen: (open: boolean) => void,
    onSpaceCreated?: () => void
}) => {
    const [selectedMap, setSelectedMap] = useState<Map | null>(null);
    const [maps, setMaps] = useState<Map[]>([]);
    const [name, setName] = useState("");
    const [dimensions, setDimensions] = useState("")

    const getAllMaps = async () => {
        try {
            const response = await getMaps();
            setMaps(response);
        } catch (error) {
            console.error('Failed to fetch maps:', error);
        }
    };

    useEffect(() => {
        getAllMaps();
    }, []);

    const handleCreateSpace = async () => {
        if (!name.trim() || !dimensions.trim()) {
            // Show validation error
            return;
        }

        try {
            // Implement your space creation logic her

            // Close the modal
            const response = await createSpace({ name, dimensions, 'mapId': selectedMap?.id })
            if ('spaceId' in response)
                onSpaceCreated && onSpaceCreated();

            setIsCreateSpaceOpen(false);

            // Trigger the space created callback if provided
        } catch (error) {
            console.error('Failed to create space:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create a New Space</h3>

                {/* Input fields for name and dimensions */}
                <div className="mb-4">
                    <label htmlFor="space-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Space Name
                    </label>
                    <input
                        id="space-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter space name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="space-dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions
                    </label>
                    <input
                        id="space-dimensions"
                        type="text"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="e.g., 100x100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <h4 className="text-md font-medium text-gray-900 mb-4">Select a Map</h4>

                {/* Scrollable maps container */}
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="grid grid-cols-3 gap-4">
                        {maps.map((map) => (
                            <div
                                key={map.id}
                                className={`bg-gray-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 
                                    ${selectedMap?.id === map.id
                                        ? 'border-4 border-blue-500 transform scale-105'
                                        : 'hover:border-2 hover:border-blue-300'
                                    }`}
                                onClick={() => setSelectedMap(map)}
                            >
                                <img
                                    src={map.thumbnail}
                                    alt={map.name}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-2">
                                    <h4 className="text-gray-800 font-medium text-sm truncate">{map.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded
                            ${!name.trim() || !dimensions.trim()
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-600'}`}
                        onClick={handleCreateSpace}
                        disabled={!name.trim() || !dimensions.trim()}
                    >
                        Create Space
                    </button>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                        onClick={() => setIsCreateSpaceOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSpaceModal;