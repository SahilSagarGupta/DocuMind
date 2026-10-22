// This is the home page of the website.
// It explains what DocuMind is, and has one big button that opens the app.

// The three steps shown in the "How it works" section
const steps = [
    {
        number: "01",
        title: "Upload a document",
        text: "Add a PDF such as a policy manual, handbook or report to a chat."
    },
    {
        number: "02",
        title: "Ask in plain English",
        text: "Type your question the way you would ask a colleague. No special keywords needed."
    },
    {
        number: "03",
        title: "Check the source",
        text: "Every answer shows the page and the exact passage it was taken from."
    }
]

// The three features shown near the bottom
const features = [
    {
        title: "Every answer has a source",
        text: "Click a page tag like p.2 and the exact passage is shown, highlighted."
    },
    {
        title: "Honest when it does not know",
        text: "If the answer is not in your documents, DocuMind says so instead of guessing."
    },
    {
        title: "Documents stay in their chat",
        text: "A new chat starts empty. Nothing from another chat or document leaks in."
    }
]

// The technologies shown in the footer
const techStack = ["React", "Node.js", "FastAPI", "ChromaDB", "MongoDB"]

function LandingPage() {
    return (
        <div className="min-h-screen bg-paper text-ink">

            <header className="max-w-5xl mx-auto px-6 py-5">
                <span className="font-display font-semibold text-xl">DocuMind</span>
            </header>

            {/* Hero: headline, short description and the main button */}
            <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pb-16">
                <p className="font-mono text-xs text-slate uppercase tracking-widest mb-4">
                    Question answering for your documents
                </p>

                <h1 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-tight max-w-3xl mb-6">
                    <span className="block">Answers from your documents.</span>
                    <span className="block">Every one <span className="bg-highlight/40 px-1">can be checked.</span></span>
                </h1>

                <p className="text-slate text-base sm:text-lg max-w-xl mb-10">
                    Upload a document, ask a question in plain English, and get an answer together with the exact page and passage it came from.
                </p>

                <a
                    href="#/app"
                    className="inline-block bg-ink text-paper text-base font-medium rounded-lg px-8 py-4 cursor-pointer hover:opacity-90"
                >
                    Open DocuMind →
                </a>
            </section>

            {/* How it works: three simple steps */}
            <section className="max-w-5xl mx-auto px-6 py-16 border-t border-fog">
                <h2 className="font-display font-semibold text-2xl sm:text-3xl text-center mb-10">
                    How it works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map(function (step) {
                        return (
                            <div key={step.number} className="bg-white border border-fog rounded-xl p-6">
                                <div className="font-mono text-xs bg-highlight/20 inline-block px-2 py-1 rounded mb-4">
                                    {step.number}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                                <p className="text-sm text-slate leading-relaxed">{step.text}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Example: a small picture of what an answer looks like */}
            <section className="max-w-2xl mx-auto px-6 pb-20">
                <p className="font-mono text-xs text-slate uppercase tracking-widest text-center mb-4">
                    Illustrative example
                </p>

                <div className="bg-white border border-fog rounded-xl p-5">
                    <div className="flex justify-end mb-3">
                        <div className="bg-ink text-paper text-sm rounded-2xl rounded-br-sm px-4 py-2">
                            How long is the notice period for resigning?
                        </div>
                    </div>

                    <div className="bg-paper border border-fog text-sm rounded-2xl rounded-bl-sm px-4 py-3 mb-3">
                        Employees must give 30 days of written notice before resigning.
                        <div className="mt-2">
                            <span className="font-mono text-xs bg-highlight/20 px-2 py-1 rounded">p.12</span>
                        </div>
                    </div>

                    <div className="text-sm leading-relaxed bg-highlight/10 border-l-4 border-highlight rounded-lg p-3">
                        <span className="font-mono text-xs text-slate block mb-1">Source, page 12</span>
                        Any employee who wishes to resign must give <span className="bg-highlight/50">thirty (30) days written notice</span> to their manager.
                    </div>
                </div>
            </section>

            {/* Features: what makes DocuMind different */}
            <section className="max-w-5xl mx-auto px-6 py-16 border-t border-fog">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map(function (feature) {
                        return (
                            <div key={feature.title}>
                                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate leading-relaxed">{feature.text}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Footer: who built it and what it is built with */}
            <footer className="border-t border-fog">
                <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate">
                        MCA (AI &amp; ML) project by Sahil Sagar Gupta
                    </p>

                    <div className="flex flex-wrap justify-center gap-2">
                        {techStack.map(function (tech) {
                            return (
                                <span key={tech} className="font-mono text-xs border border-fog rounded px-2 py-1 text-slate">
                                    {tech}
                                </span>
                            )
                        })}
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default LandingPage