export default function Facts() {
  const articles = [
    {
      id: 1,
      title: "Common Cold",
      content:
        "The common cold is a viral infection of your nose and throat (upper respiratory tract).",
    },
    {
      id: 2,
      title: "Diabetes",
      content:
        "Diabetes occurs when your blood glucose is too high. Insulin helps glucose enter your cells for energy.",
    },
    {
      id: 3,
      title: "Medical Research Papers",
      content:
        "Ongoing studies are exploring how AI can assist doctors in diagnosing rare diseases.",
    },
  ];

  return (
    <div className="bg-gray-50 px-6 py-10 min-h-screen ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
          <span className="text-pink-600">Medical Facts & Articles</span>
        </h1>

        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-400 hover:border-pink-400 transition"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-700">{article.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
