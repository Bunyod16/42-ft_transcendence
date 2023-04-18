import { create } from 'zustand';

interface ChannelObject {
	name: string;
}

interface ChannelStoreType {
	channels: string[] | [];
	addChannel: (channel: string) => void;
	removeChannel: (channel: string) => void;
}

const channelStore = create<ChannelStoreType>((set)=>(
	{
		channels: [],
		addChannel: (channel: string) => {
			set((state) => (
				{channels: [...state.channels, channel]}
			))
		},
		removeChannel: (channel: string) => {
			set((state) => (
				{channels: state.channels.filter( stateChannel => stateChannel !== channel)}
			))
		},
	}
))