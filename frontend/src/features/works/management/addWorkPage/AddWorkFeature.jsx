import AddItemDialog from "@/features/items/management/components/AddItemDialog.jsx";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog.jsx";
import WorkFormStep from "@/features/works/management/addWorkPage/steps/WorkFormStep.jsx";
import AuthorConflictDialog from "@/features/works/management/addWorkPage/steps/AuthorWorkConflictDialog.jsx";
import { useNavigate } from "react-router-dom";
import { useAddWork } from "@/features/works/management/addWorkPage/useAddWork.js";


export default function AddWorkFeature() {
    const {
        step,
        form,
        conflicts,
        isbnLoading,
        addItemOpen,
        addItemWork,
        confirmCopyOpen,
        askAddItemOpen,
        setAddItemOpen,
        setConfirmCopyOpen,
        submitLoading,
        fetchByIsbn,
        submit,
        resolveConflicts,
        backToForm,
        handleConfirmAddCopy,
        handleConfirmAskAddItem,
        handleDeclineAskAddItem
    } = useAddWork();

    const navigate = useNavigate();

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

                {/* Form principale - resta una pagina, viste le dimensioni */}
                <WorkFormStep
                    form={form}
                    isbnLoading={isbnLoading}
                    submitLoading={submitLoading}
                    onIsbnSearch={fetchByIsbn}
                    onSubmit={submit}
                />

            </div>

            {/* Dialog di risoluzione conflitti autori (es. autori omonimi) */}
            <AuthorConflictDialog
                open={step === "conflicts"}
                conflicts={conflicts}
                onResolve={resolveConflicts}
                onBack={backToForm}
                loading={submitLoading}
            />

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

            {/* Dialog di conferma per aggiunta nuova copia all'opera */}
            <ConfirmDialog
                open={askAddItemOpen}
                onClose={handleDeclineAskAddItem}
                onConfirm={handleConfirmAskAddItem}
                closeOnConfirm={false}
                title={"Opera aggiunta"}
                description={
                    addItemWork?.title ? `Vuoi aggiungere subito una copia di "${addItemWork.title}"?` : "Vuoi aggiungere una nuova copia?"
                }
                confirmLabel="Aggiungi copia"
                cancelLabel="No, grazie"
            />

            {/* Dialog per l'aggiunta delle copie */}
            <AddItemDialog
                open={addItemOpen}
                onClose={() => {
                    setAddItemOpen(false);
                    navigate("/admin/works");
                }}
                workId={addItemWork?.id}
                workTitle={addItemWork?.title}
            />
        </main>
    )
}