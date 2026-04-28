export type ASLCard = {
  id: string;
  label: string;
  meaning: string;
  image: string;
  category: "basic" | "emotion" | "needs" | "communication";
};

export const aslCards: ASLCard[] = [
  // Basic greetings & identity
  { id: "hello",       label: "HELLO",       meaning: "Hello / Greeting",       image: "/asl/hello.png",       category: "basic" },
  { id: "my-name-is",  label: "MY NAME IS",  meaning: "Introducing myself",      image: "/asl/my-name-is.png",  category: "communication" },
  { id: "thank-you",   label: "THANK YOU",   meaning: "I am grateful",           image: "/asl/thank-you.png",   category: "basic" },
  { id: "please",      label: "PLEASE",      meaning: "Please / Request kindly",  image: "/asl/please.png",      category: "communication" },
  { id: "sorry",       label: "SORRY",       meaning: "I apologize",             image: "/asl/sorry.png",       category: "communication" },
  { id: "i-love-you",  label: "I LOVE YOU",  meaning: "I love you",              image: "/asl/i-love-you.png",  category: "emotion" },

  // Yes / No / Questions
  { id: "yes",         label: "YES",         meaning: "Yes / I agree",           image: "/asl/yes.png",         category: "communication" },
  { id: "no",          label: "NO",          meaning: "No / I disagree",         image: "/asl/no.png",          category: "communication" },
  { id: "how",         label: "HOW",         meaning: "How?",                    image: "/asl/how.png",         category: "communication" },
  { id: "what",        label: "WHAT",        meaning: "What?",                   image: "/asl/what.png",        category: "communication" },
  { id: "where",       label: "WHERE",       meaning: "Where?",                  image: "/asl/where.png",       category: "communication" },
  { id: "when",        label: "WHEN",        meaning: "When?",                   image: "/asl/when.png",        category: "communication" },

  // Urgent needs
  { id: "help",        label: "HELP",        meaning: "I need assistance",       image: "/asl/help.png",        category: "needs" },
  { id: "stop",        label: "STOP",        meaning: "I need this to stop",     image: "/asl/stop.png",        category: "communication" },
  { id: "more",        label: "MORE",        meaning: "I want more",             image: "/asl/more.png",        category: "needs" },
  { id: "eat",         label: "EAT",         meaning: "I am hungry",             image: "/asl/eat.png",         category: "needs" },
  { id: "drink",       label: "DRINK",       meaning: "I am thirsty",            image: "/asl/drink.png",       category: "needs" },
  { id: "bathroom",    label: "BATHROOM",    meaning: "I need to go",            image: "/asl/bathroom.png",    category: "needs" },

  // Pain & emotion
  { id: "pain",        label: "PAIN",        meaning: "I am hurting",            image: "/asl/pain.png",        category: "emotion" },
];

// Convenience grouped views
export const aslCardsByCategory = {
  basic:         aslCards.filter((c) => c.category === "basic"),
  emotion:       aslCards.filter((c) => c.category === "emotion"),
  needs:         aslCards.filter((c) => c.category === "needs"),
  communication: aslCards.filter((c) => c.category === "communication"),
};
