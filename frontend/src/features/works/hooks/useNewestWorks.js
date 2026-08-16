import {useWorks} from "@/features/works/hooks/useWorks.js";

// Passo la rotta che restituisce le nuove opere (con limite 10)
export const useNewestWorks = () =>
    useWorks(`/works/newest?limit=10`);