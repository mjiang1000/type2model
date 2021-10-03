interface ID {
  name: string;
  code: number;
}

interface Score {
  name: string;
  level: string;
  date: string|Date
}

interface Stu {
  age: number;
  sex: boolean;
  id: ID;
  name: string;
  scores: Score[];
}
