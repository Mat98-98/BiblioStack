import { useAddWork } from "./useAddWork.js";
import WorkFormStep from "./steps/WorkFormStep.jsx";
import AuthorConflictStep from "./steps/AuthorConflictStep.jsx";
import AddItemDialog from "@/features/items/management/components/AddItemDialog.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";


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
        confirmCopyOpen,
        setAddItemOpen,
        setConfirmCopyOpen,
        submitLoading,
        fetchByIsbn,
        submit,
        resolveConflicts,
        backToForm,
        handleConfirmAddCopy,
    } = useAddWork()

    const StepComponent = steps[step]

    return (
        <main className="min-h-screen bg-background">
            <div className="space-y-8">

                {/* Intestazione della pagina */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Aggiungi opera</h1>
                    <p className="text-sm pt-2 pb-4 text-muted-foreground">
                        Cerca per ISBN per compilare automaticamente i dati, poi completa le informazioni mancanti.
                    </p>
                </div>

                {/* Render dinamico dello step corrente (Form dati oppure Conflitti autori) */}
                <StepComponent
                    // Props per WorkFormStep
                    form={form}
                    isbnLoading={isbnLoading}
                    submitLoading={submitLoading}
                    onIsbnSearch={fetchByIsbn}
                    onSubmit={submit}
                    // Props per AuthorConflictStep
                    conflicts={conflicts}
                    onResolve={resolveConflicts}
                    onBack={backToForm}
                    loading={submitLoading}
                />

            </div>

            {/* Dialog di avviso: l'opera cercata tramite ISBN esiste già nel catalogo */}
            <ConfirmDialog
                open={confirmCopyOpen}
                onClose={() => setConfirmCopyOpen(false)}
                onConfirm={handleConfirmAddCopy}
                title="Opera già presente"
                description={
                    addItemWork?.title
                        ? `L'opera "${addItemWork.title}" è già presente nel catalogo. Vuoi aggiungere una nuova copia?`
                        : "Questa opera è già presente nel catalogo. Vuoi aggiungere una nuova copia?"
                }
                confirmLabel="Aggiungi copia"
                cancelLabel="Annulla"
            />

            {/* Dialog per l'aggiunta delle copie (gestisce internamente il loop di inserimento multiplo) */}
            <AddItemDialog
                open={addItemOpen}
                onClose={() => setAddItemOpen(false)}
                workId={addItemWork?.id}
                workTitle={addItemWork?.title}
            />

        </main>
    )
}