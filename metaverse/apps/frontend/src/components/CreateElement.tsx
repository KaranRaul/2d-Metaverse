import React, { useState } from 'react';
import { createElement } from '../api/space';

const CreateElement = ({ setIsElementCreateOpen }: { setIsElementCreateOpen: (isOpen: boolean) => void }) => {
    const [newElement, setNewElement] = useState({
        imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
        width: 1,
        height: 1,
        static: true,
    });

    const handleSubmit = async () => {
        // Handle the creation of the new element
        await createElement(newElement);
        setIsElementCreateOpen(false);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'imageUrl' | 'width' | 'height' | 'static'
    ) => {
        setNewElement((prevElement) => ({
            ...prevElement,
            [field]: field === 'static' ? e.target.checked : e.target.value,
        }));
    };

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Element</h3>
                <form className="max-w-sm mx-auto">
                    <div className="mb-5">
                        <label htmlFor="imageUrl" className="block mb-2 text-sm font-medium text-gray-900 dark-text-white">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="imageUrl"
                            value={newElement.imageUrl}
                            onChange={(e) => handleInputChange(e, 'imageUrl')}
                            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="width" className="block mb-2 text-sm font-medium text-gray-900 dark-text-white">
                            Width
                        </label>
                        <input
                            type="number"
                            id="width"
                            value={newElement.width}
                            onChange={(e) => handleInputChange(e, 'width')}
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="height" className="block mb-2 text-sm font-medium text-gray-900 dark-text-white">
                            Height
                        </label>
                        <input
                            type="number"
                            id="height"
                            value={newElement.height}
                            onChange={(e) => handleInputChange(e, 'height')}
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-placeholder-gray-400 dark-text-white dark-focus:ring-blue-500 dark-focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="static"
                            checked={newElement.static}
                            onChange={(e) => handleInputChange(e, 'static')}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark-bg-gray-700 dark-border-gray-600 dark-focus:ring-blue-600 dark-focus:ring-offset-gray-800"
                        />
                        <label htmlFor="static" className="ml-2 text-sm font-medium text-gray-900 dark-text-white">
                            Static
                        </label>
                    </div>
                    <div className="mt-4 flex justify-end">
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
                            onClick={() => setIsElementCreateOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateElement;