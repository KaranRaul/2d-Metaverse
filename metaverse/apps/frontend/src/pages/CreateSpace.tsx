import { useState } from 'react';

const CreateSpace = () => {
    const [spaceName, setSpaceName] = useState('');

    const handleCreate = () => {
        // API call or logic to create the space with the entered name
        console.log('Space Created:', spaceName);
    };

    return (
        <div className="create-space">
            <h1>Create a New Space</h1>
            <input
                type="text"
                placeholder="Enter Space Name"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
            />
            <button onClick={handleCreate}>Create Space</button>
        </div>
    );
};

export default CreateSpace;
