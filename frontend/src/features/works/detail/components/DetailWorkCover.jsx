import { BookOpen } from "lucide-react";

export default function DetailWorkCover({ coverUrl, title }) {
    if (coverUrl) {
        return (
            <img
                src={coverUrl}
                alt={title}
                className="w-52 h-78 rounded-2xl object-cover shadow-md mx-auto md:mx-0 shrink-0"
            />
        );
    }
    return (
        <div className="w-52 h-78 rounded-2xl bg-secondary flex items-center justify-center mx-auto md:mx-0 shrink-0">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
        </div>
    );
}