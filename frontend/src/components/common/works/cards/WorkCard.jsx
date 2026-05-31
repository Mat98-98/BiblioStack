import { Link } from 'react-router-dom';

function formatAuthors(authors) {
    return authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
}

// @todo Texture per la copertina finta
function FakeCover({ title, authors }) {
    return (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-4 flex flex-col justify-between">

            {/* Center */}
            <div className="flex-1 flex items-center">
                <h3 className="text-lg font-bold leading-tight line-clamp-4">
                    {title}
                </h3>
            </div>

            {/* Bottom */}
            <div>
                <p className="text-xs opacity-70 line-clamp-2">
                    {formatAuthors(authors)}
                </p>
            </div>
        </div>
    )
}

export default function WorkCard({ work }) {
    return (
        <Link to={`/works/${work.id}`} className="group flex flex-col rounded-md border border-border bg-card overflow-hidden hover:shadow-md transition-shadow h-70 w-40">

            <div className="aspect-2/3 bg-secondary/50 flex items-center justify-center overflow-hidden">
                {work.coverUrl ? (
                    <img
                        src={work.coverUrl}
                        alt={work.title}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <FakeCover title={work.title} authors={work.authors} />
                )}
            </div>

            <div className="flex flex-col gap-1 p-3">
                <span className="font-semibold text-sm leading-tight line-clamp-2">
                    {work.title}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                    {formatAuthors(work.authors)}
                </span>
            </div>

        </Link>
    )
}

/*
export default function WorkCard({ work }) {
    return (
        <div className="group flex flex-col rounded-md border border border-border bg-card overflow-hidden hover:shadow-md transition-shadow h-70 w-40">


            <div className="aspect-2/3 bg-secondary/50 flex items-center justify-center overflow-hidden">

                {work.coverUrl ? (
                    <img
                        src={work.coverUrl}
                        alt={work.title}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                ) : (
                    <FakeCover
                        title={work.title}
                        authors={work.authors}
                    />
                )}

            </div>


            <div className="flex flex-col gap-1 p-3">
                <span className="font-semibold text-sm leading-tight line-clamp-2">
                    {work.title}
                </span>

                <span className="text-xs text-muted-foreground line-clamp-1">
                    {formatAuthors(work.authors)}
                </span>
            </div>

        </div>
    )
}
 */
