import WorkIsbnSearch from "../components/WorkIsbnSearch.jsx"
import WorkForm from "../components/WorkForm.jsx"

export default function WorkFormStep({ form, isbnLoading, submitLoading, onIsbnSearch, onSubmit }) {
    return (
        <div className="space-y-6">
            <div className="mb-18">
                <WorkIsbnSearch onSearch={onIsbnSearch} loading={isbnLoading} />
            </div>

            <WorkForm form={form} onSubmit={onSubmit} loading={submitLoading} />
        </div>
    )
}