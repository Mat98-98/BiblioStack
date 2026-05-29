import Navbar from "@/components/layout/navbar/Navbar.jsx"
import WorkFormStep from "./steps/WorkFormStep"
import AuthorConflictStep from "./steps/AuthorConflictStep"
import { useAddWork } from "./useAddWork"

const steps = {
    form:      WorkFormStep,
    conflicts: AuthorConflictStep,
}

export default function AddWorkPage() {
    const {
        step,
        form,
        conflicts,
        isbnLoading,
        submitLoading,
        fetchByIsbn,
        submit,
        resolveConflicts,
        backToForm,
    } = useAddWork()

    const StepComponent = steps[step]

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="mx-auto max-w-2xl px-4 pt-24 pb-12 space-y-8">

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Aggiungi opera</h1>
                    <p className="text-sm text-muted-foreground">
                        Cerca per ISBN per compilare automaticamente i dati, poi completa le informazioni mancanti.
                    </p>
                </div>

                <StepComponent
                    // WorkFormStep props
                    form={form}
                    isbnLoading={isbnLoading}
                    submitLoading={submitLoading}
                    onIsbnSearch={fetchByIsbn}
                    onSubmit={submit}
                    // AuthorConflictStep props
                    conflicts={conflicts}
                    onResolve={resolveConflicts}
                    onBack={backToForm}
                    loading={submitLoading}
                />

            </div>
        </main>
    )
}