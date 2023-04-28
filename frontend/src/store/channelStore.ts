import { create } from "zustand";

interface ChannelStoreType {
  channels: string[] | [];
  addChannel: (channel: string) => void;
  removeChannel: (channel: string) => void;
}

const channelStore = create<ChannelStoreType>((set) => ({
  channels: [],
  addChannel: (channel: string) => {
    set((state) => ({ channels: [...state.channels, channel] }));
  },
  removeChannel: (channel: string) => {
    set((state) => ({
      channels: state.channels.filter(
        (stateChannel) => stateChannel !== channel,
      ),
    }));
  },
}));

export default channelStore;

// JSON Array of Object of
// /chat-channel-member/usersGroupMessages
// {
//   "id": 3,
//   "joinedAt": "2023-04-27T08:34:55.467Z",
//   "isAdmin": false,
//   "isBlacklisted": false,
//   "mutedUntil": null,
//   "chatChannel": {
//       "id": 2,
//       "name": "Gang Gang",
//       "created_at": "2023-04-27T08:34:55.434Z",
//       "channel_type": "public",
//       "chatType": "group_message"
//   }
// },
