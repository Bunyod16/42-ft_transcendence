export interface ChatChannel {
  id: number;
  name: string;
  channel_type: "public" | "private";
  chatType: "group_message" | "direct_message";
}

export interface Channel {
  id: number;
  chatChannel: ChatChannel;
  isAdmin: boolean;
  isBlackListed: boolean;
  mutedUntil: null;
}

export interface FriendType {
  id: number;
  nickName: string;
  avatar: string;
  wins: number;
  losses: number;
  online: boolean;
  chatChannel: Channel;
}

export interface PanelData {
  chatChannel: Channel;
  friendInfo: FriendType | null;
}
