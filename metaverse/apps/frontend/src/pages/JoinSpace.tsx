import { useState } from 'react';

const JoinSpace = () => {
    const [spaceId, setSpaceId] = useState('');

    const handleJoin = () => {
        // API call or logic to join a space using the entered spaceId
        console.log('Joining Space:', spaceId);
    };

    return (
        <div className="join-space">
            <h1>Join an Existing Space</h1>
            <input
                type="text"
                placeholder="Enter Space ID"
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
            />
            <button onClick={handleJoin}>Join Space</button>
        </div>
    );
};

export default JoinSpace;
