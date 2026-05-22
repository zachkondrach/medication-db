function ResearchLinks({ links }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Research & References</h2>
      <div className="space-y-4">
        {links.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-400 transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-blue-600 hover:underline">{link.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2">
                    {link.sourceType === 'paper' ? '📄 Research Paper' : '📋 Case Study'}
                  </span>
                  {link.year && <span>Published: {link.year}</span>}
                </p>
              </div>
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ResearchLinks;
