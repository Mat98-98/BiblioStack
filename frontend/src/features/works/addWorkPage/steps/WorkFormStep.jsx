import WorkIsbnSearch from "../components/WorkIsbnSearch"
import WorkForm from "../components/WorkForm"

export default function WorkFormStep({ form, isbnLoading, submitLoading, onIsbnSearch, onSubmit }) {
    return (
        <div className="space-y-8">
            <WorkIsbnSearch onSearch={onIsbnSearch} loading={isbnLoading} />
            <WorkForm form={form} onSubmit={onSubmit} loading={submitLoading} />
        </div>
    )
}