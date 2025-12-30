export enum RoomType {
  MAIN = 'Sala principal',
  AUX_1 = 'Sala auxiliar núm. 1',
  AUX_2 = 'Sala auxiliar núm. 2',
}

export interface AssignmentData {
  name: string;
  assistant: string;
  date: string;
  assignmentNumber: string;
  room: RoomType | null;
}
