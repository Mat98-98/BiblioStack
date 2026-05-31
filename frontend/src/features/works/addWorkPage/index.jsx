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
            <div className="space-y-8">

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Aggiungi opera</h1>
                    <p className="text-sm pt-2 pb-4 text-muted-foreground">
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