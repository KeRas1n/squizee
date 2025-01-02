export interface NicknameInputProps {
    setNickname: (nickname: string) => void;
    setRoomId: (roomId: string) => void;
    connect: () => void;
  }
  
  export interface RoomProps {
    nickname: string;
    roomId: string;
  }
  