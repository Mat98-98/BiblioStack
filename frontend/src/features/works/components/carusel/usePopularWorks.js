import { useWorks } from "@/features/works/components/carusel/useWorks.js";

// Passo la rotta che restituisce i libri più prestati (con limite 10)
export const usePopularWorks = () =>
    useWorks(`/works/mostLoaned?limit=10`);