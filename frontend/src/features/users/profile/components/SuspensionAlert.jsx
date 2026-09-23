import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item.jsx";
import { CircleAlert } from "lucide-react";
import {formatDateNumeric} from "@/lib/dateUtils.js";

export default function SuspensionAlert({ suspension }) {
    if (!suspension) return null;

    const endDate = formatDateNumeric(suspension.endDate);

    return (
        <Item
            variant="outline"
            className="w-full rounded-2xl border-destructive/40 bg-destructive/5"
        >
            <ItemMedia variant="icon" className="bg-destructive/10 text-destructive">
                <CircleAlert className="h-5 w-5 shrink-0" />
            </ItemMedia>

            <ItemContent>
                <ItemTitle className="text-destructive text-sm font-semibold">
                    Il tuo account è stato sospeso
                </ItemTitle>

                <ItemDescription className="font-medium">
                    {endDate
                        ? `La sospensione terminerà il: ${endDate}.`
                        : "Sospensione permanente."
                    }
                </ItemDescription>

                {suspension.reason && (
                    <ItemDescription>
                        <span className="font-medium">Motivazione:</span>{" "}
                        {suspension.reason}
                    </ItemDescription>
                )}
            </ItemContent>
        </Item>
    );
}