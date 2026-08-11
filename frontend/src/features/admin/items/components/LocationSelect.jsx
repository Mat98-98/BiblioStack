import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";

// Raggruppa le location per nome scuola
const groupBySchool = (locations) =>
    locations.reduce((acc, loc) => {
        const school = loc.school?.name ?? "Senza scuola";
        if (!acc[school]) acc[school] = [];
        acc[school].push(loc);
        return acc;
    }, {});

export default function LocationSelect({ locations, onValueChange }) {
    const grouped = groupBySchool(locations);

    return (
        <Select onValueChange={(val) => onValueChange(val ? Number(val) : null)}>
            <SelectTrigger>
                <SelectValue placeholder="Seleziona una posizione" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(grouped).map(([school, locs]) => (
                    <div key={school}>
                        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {school}
                        </p>
                        {locs.map((loc) => (
                            <SelectItem key={loc.id} value={String(loc.id)}>
                                {loc.shelfCode ?? `Scaffale ${loc.id}`}
                            </SelectItem>
                        ))}
                    </div>
                ))}
            </SelectContent>
        </Select>
    );
}