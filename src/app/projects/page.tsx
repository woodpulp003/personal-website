export default function Projects() {
  const projects = [
    {
      title: "Project 1",
      description: "Description of your first project",
      tags: ["React", "TypeScript"],
      link: "#"
    },
    {
      title: "Project 2",
      description: "Description of your second project",
      tags: ["Next.js", "Tailwind"],
      link: "#"
    },
    // Add more projects as needed
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="border rounded-lg p-6 hover:border-stone-400 transition-colors">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-stone-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 