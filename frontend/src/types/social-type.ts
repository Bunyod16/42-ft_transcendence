export interface ChatChannel {
  id: number;
  name: string;
  channel_type: "public" | "private";
  chatType: "group_message" | "direct_message";
}

export interface Channel {
  id: number;
  isAdmin: boolean;
  ownerId: number;
  isBlackListed: boolean;
  mutedUntil: null;
  chatChannel: ChatChannel;
}

export interface ChannelMember {
  id: number;
  isAdmin: boolean;
  ownerId: number;
  isBlackListed: boolean;
  mutedUntil: null;
  user: UserInfo;
}

// change this to use UserInfo
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

export interface UserInfo {
  id: number;
  nickName: string;
  avatar: string;
  wins: number;
  losses: number;
  online: boolean;
}

export enum TabTypes {
  friends,
  channels,
}
