export interface UserGamingList {
    id?: string;
    userId: string;
    games: Array<{
      gameId: string;
      createDate: string;
    }>;
  }