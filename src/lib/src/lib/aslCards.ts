export type ASLCard = {
  id: string;
  label: string;
  meaning: string;
  image: string;
  category: "basic" | "emotion" | "needs" | "communication";
};

export const aslCards: ASLCard[] = [
  {
    id: "help",
    label: "HELP",
    meaning: "I need assistance",
    image: "/asl/help.png",
    category: "needs",
  },
  {
    id: "stop",
    label: "STOP",
    meaning: "I need this to stop",
    image: "/asl/stop.png",
    category: "communication",
  },
  {
    id: "pain",
    label: "PAIN",
    meaning: "I am hurting",
    image: "/asl/pain.png",
    category: "emotion",
  },
  {
    id: "eat",
    label: "EAT",
    meaning: "I am hungry",
    image: "/asl/eat.png",
    category: "needs",
  },
  {
    id: "drink",
    label: "DRINK",
    meaning: "I am thirsty",
    image: "/asl/drink.png",
    category: "needs",
  },
  {
    id: "bathroom",
    label: "BATHROOM",
    meaning: "I need to go",
    image: "/asl/bathroom.png",
    category: "needs",
  },
];
