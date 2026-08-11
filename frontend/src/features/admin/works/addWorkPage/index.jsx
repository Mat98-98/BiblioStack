import WorkFormStep from "./steps/WorkFormStep.jsx";
import AuthorConflictStep from "./steps/AuthorConflictStep.jsx";
import { useAddWork } from "./useAddWork.js";
import AddItemDialog from "@/features/admin/items/AddItemDialog.jsx";

const steps = {
    form:      WorkFormStep,
    conflicts: AuthorConflictStep,
}

export default function AddWorkFeature() {
    const {
        step,
        form,
        conflicts,
        isbnLoading,
        addItemOpen,
        addItemWork,
        setAddItemOpen,
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

            {/*Aggiunta copie*/}
            <AddItemDialog
                open={addItemOpen}
                onClose={() => setAddItemOpen(false)}
                onSuccess={() => setAddItemOpen(false)}
                workId={addItemWork?.id}
                workTitle={addItemWork?.title}
            />

        </main>
    )
}