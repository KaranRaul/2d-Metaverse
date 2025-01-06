import React, { useEffect, useState } from 'react';
import { createMap, getAllElements } from '../api/space';

interface DefaultElement {
    elementId: string;
    x: number;
    y: number;
}

interface AvailableElement {
    id: string;
    imageUrl: string;
    width: number;
    height: number;
    static: boolean;
}

const CreateMap = ({ setIsMapCreateOpen }: { setIsMapCreateOpen: (isOpen: boolean) => void }) => {
    const [newMap, setNewMap] = useState({
        thumbnail: 'https://thumbnail.com/a.png',
        dimensions: '100x200',
        name: '100 person interview room',
        defaultElements: [] as DefaultElement[],
    });

    const [availableElements, setAvailableElements] = useState<AvailableElement[]>([]);

    async function getAllAvailableElements() {
        try {
            const response = await getAllElements();
            console.log(response);
            setAvailableElements(response);

        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getAllAvailableElements();
    }, [])

    const handleSubmit = async () => {
        try {
            const response = await createMap(newMap);
            if ('id' in response) {
                console.log('Map created successfully');
                setIsMapCreateOpen(false);
            } else {
                console.log('Map creation failed');
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'thumbnail' | 'dimensions' | 'name'
    ) => {
        setNewMap((prevMap) => ({
            ...prevMap,
            [field]: e.target.value,
        }));
    };

    const handleAddElement = (element: AvailableElement) => {
        setNewMap((prevMap) => ({
            ...prevMap,
            defaultElements: [
                ...prevMap.defaultElements,
                { elementId: element.id, x: 0, y: 0 },
            ],
        }));
    };

    const handleDefaultElementChange = (
        index: number,
        field: 'elementId' | 'x' | 'y',
        value: string | number
    ) => {
        setNewMap((prevMap) => ({
            ...prevMap,
            defaultElements: prevMap.defaultElements.map((element, i) =>
                i === index
                    ? {
                        ...element,
                        [field]: value,
                    }
                    : element
            ),
        }));
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Map</h3>
                <div className="overflow-y-auto flex-grow">
                    <form className="max-w-xl mx-auto">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="thumbnail" className="block mb-2 text-sm font-medium text-gray-900 dark-text-white">
                                    Thumbnail
                                </label>
                                <input
                                    type="text"
                                    id="thumbnail"
                                    value={newMap.thumbnail}
                                    onChange={(e) => handleInputChange(e, 'thumbnail')}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="dimensions" className="block mb-2 text-sm font-medium text-gray-900 dark-text-white">
                                    Dimensions
                                </label>
                                <input
                                    type="text"
                                    id="dimensions"
                                    value={newMap.dimensions}
                                    onChange={(e) => handleInputChange(e, 'dimensions')}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark-text-white">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newMap.name}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Default Elements</h4>
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-3 gap-6">
                                    {newMap.defaultElements.map((element, index) => (
                                        <div key={index}>
                                            <label
                                                htmlFor={`element-${index}-id`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                                            >
                                                Element ID
                                            </label>
                                            <input
                                                type="text"
                                                id={`element-${index}-id`}
                                                value={element.elementId}
                                                onChange={(e) => handleDefaultElementChange(index, 'elementId', e.target.value)}
                                                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                                            />
                                            <label
                                                htmlFor={`element-${index}-x`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                                            >
                                                X
                                            </label>
                                            <input
                                                type="number"
                                                id={`element-${index}-x`}
                                                value={element.x}
                                                onChange={(e) => handleDefaultElementChange(index, 'x', Number(e.target.value))}
                                                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                                            />
                                            <label
                                                htmlFor={`element-${index}-y`}
                                                className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                                            >
                                                Y
                                            </label>
                                            <input
                                                type="number"
                                                id={`element-${index}-y`}
                                                value={element.y}
                                                onChange={(e) => handleDefaultElementChange(index, 'y', Number(e.target.value))}
                                                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Available Elements</h4>
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-4 gap-4">
                                    {availableElements.map((element) => (
                                        <div
                                            key={element.id}
                                            className="bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-300 transition-colors"
                                            onClick={() => handleAddElement(element)}
                                        >
                                            <img src={element.imageUrl} alt={element.id} className="w-full h-auto" />
                                            <div className="p-2">
                                                <h4 className="text-gray-800 font-medium">{element.id}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                onClick={handleSubmit}
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                                onClick={() => setIsMapCreateOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateMap;