import Navbar from "@/components/layout/navbar/Navbar.jsx"
import { Button } from "@/components/ui/button.jsx";
import { useNewestWorks } from "@/features/works/components/carusel/useNewestWorks.js";
import WorkCarousel from "@/features/works/components/carusel/WorkCarusel.jsx";
import { Link } from "react-router-dom";
import {usePopularWorks} from "@/features/works/components/carusel/usePopularWorks.js";



export default function HomePage() {

    const newest = useNewestWorks();
    const mostLoaned = usePopularWorks()

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors">

            <Navbar />

            {/* Hero */}
            <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
                <div className="space-y-6">
                    <h2 className="text-5xl font-bold tracking-tight mt-25 leading-normal">
                        Benvenuto su BiblioStack
                    </h2>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Cerca, prenota e gestisci i tuoi prestiti in pochi tap.
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center mt-15 w-40">
                    <Button type="button" className="w-full h-11 duration-300">
                        <Link to="/catalog">Sfoglia il catalogo</Link>
                    </Button>
                </div>
            </section>


            <WorkCarousel
                title="Ultimi arrivi"
                works={newest.works}
                loading={newest.loading}
                error={newest.error}
            />

            <WorkCarousel
                title="I più popolari"
                works={mostLoaned.works}
                loading={mostLoaned.loading}
                error={mostLoaned.error}
            />

        </main>
    )
}
//<BookCarousel title="Più popolari" limit={10} />
