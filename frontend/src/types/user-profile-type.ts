export interface UserProfile {
  nickName: string;
  id: number;
  avatar: string;
  wins: number;
  losses: number;
  online: false;
  achievements: [
    {
      id: number;
      achievement: {
        name: string;
        description: string;
        url: string;
        createdAt: Date;
      };
      createdAt: Date;
    },
  ];
  matches: [
    {
      id: number;
      isPrivate: boolean;
      createdAt: Date;
      endedAt: Date;
      playerOneScore: number;
      playerTwoScore: number;
      playerOne: {
        nickName: string;
        id: number;
        avatar: string;
        wins: number;
        losses: number;
        online: false;
      };
      playerTwo: {
        nickName: string;
        id: number;
        avatar: string;
        wins: number;
        losses: number;
        online: false;
      };
    },
  ];
}
