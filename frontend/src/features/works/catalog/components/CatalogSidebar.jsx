import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.jsx"
import CatalogFilters from "./CatalogFilters.jsx"

export default function CatalogSidebar({ filterProps, activeFiltersCount }) {
    return (
        <>
            {/* Mobile */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden fixed bottom-4 left-4 z-50 h-10 w-10 rounded-full bg-background/75 backdrop-blur border shadow-lg">
                        <SlidersHorizontal className="h-4 w-4" />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Filtri</SheetTitle>
                    </SheetHeader>
                    <CatalogFilters {...filterProps} />
                </SheetContent>
            </Sheet>

            {/* Desktop */}
            <aside className="hidden lg:block w-56 shrink-0 pl-3.5">
                <div className="sticky top-24">
                    <CatalogFilters {...filterProps} />
                </div>
            </aside>
        </>
    )
}