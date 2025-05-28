export default function Notes() {
  const categories = [
    {
      name: "Computer Science",
      notes: [
        {
          title: "Data Structures",
          description: "Notes on various data structures and their implementations",
          date: "March 19, 2024"
        },
        {
          title: "Algorithms",
          description: "Common algorithms and their time complexity",
          date: "March 18, 2024"
        }
      ]
    },
    {
      name: "Mathematics",
      notes: [
        {
          title: "Linear Algebra",
          description: "Matrix operations and vector spaces",
          date: "March 17, 2024"
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Technical Notes</h1>
      <div className="space-y-12">
        {categories.map((category, index) => (
          <section key={index}>
            <h2 className="text-2xl font-semibold mb-6">{category.name}</h2>
            <div className="space-y-4">
              {category.notes.map((note, noteIndex) => (
                <article
                  key={noteIndex}
                  className="border rounded-lg p-6 hover:border-stone-400 transition-colors"
                >
                  <h3 className="text-xl font-medium mb-2">{note.title}</h3>
                  <p className="text-stone-600 mb-4">{note.description}</p>
                  <div className="text-sm text-stone-500">Last updated: {note.date}</div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
} 