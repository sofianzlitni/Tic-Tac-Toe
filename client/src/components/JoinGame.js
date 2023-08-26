import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame() {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });

    if (response.users.length === 0) {
      alert("User Not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };
  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel}/>
        </Channel>
      ) : (
        <div className="joinGame">
          <h4>Create Game</h4>
          <input
            placeholder="username of rival..."
            onChange={(event) => {
              setRivalUsername(event.target.value);
            }}
          />
          <button onClick={createChannel}>Start/Join Game</button>
        </div>
      )}
    </>
  );
}

export default JoinGame;
