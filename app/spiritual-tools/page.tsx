export default function SpiritualToolsPage() {
  const tools = [
    {
      id: "angels",
      title: "Angels & Archangels",
      description: "Learn about the 11 archangels, their roles, colors, and how to work with them.",
      icon: "🪽"
    },
    {
      id: "lightworker-persecution",
      title: "Lightworker Persecution Clearing",
      description: "Healing from spiritual targeting, rejection, and assignment.",
      icon: "✨"
    },
    {
      id: "bloodline-healing",
      title: "Bloodline Healing",
      description: "Break inherited patterns, curses, and generational wounds.",
      icon: "🧬"
    }
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Spiritual Tools</h1>

      <div className="grid grid-cols-1 gap-4">
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={`/spiritual-tools/${tool.id}`}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10"
          >
            <div className="text-3xl mb-2">{tool.icon}</div>
            <h2 className="text-xl font-semibold">{tool.title}</h2>
            <p className="text-gray-300 text-sm mt-1">{tool.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
