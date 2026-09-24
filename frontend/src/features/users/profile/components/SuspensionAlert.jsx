import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item.jsx";
import { AlertOctagon } from "lucide-react";
import {formatDateNumeric} from "@/lib/dateUtils.js";

export default function SuspensionAlert({ suspension }) {
    if (!suspension) return null;

    const endDate = formatDateNumeric(suspension.endDate);

    return (
        <Item
            variant="outline"
            className="w-full items-center rounded-2xl border-destructive/30 bg-destructive/5"
        >
            <ItemMedia
                variant="icon"
                className="h-10 w-10 rounded-xl border-0 bg-destructive/10 text-destructive group-has-data-[slot=item-description]/item:self-center group-has-data-[slot=item-description]/item:translate-y-0"
            >
                <AlertOctagon className="size-5" />
            </ItemMedia>

            <ItemContent>
                <ItemTitle className="font-medium text-destructive">
                    Il tuo account è stato sospeso {endDate ? `fino al: ${endDate}.` : "permanentemente."
                }
                </ItemTitle>

                {suspension.reason && (
                    <ItemDescription className="text-sm text-muted-foreground">
                        <span className="font-medium">Motivazione:</span>{" "}
                        {suspension.reason}
                    </ItemDescription>
                )}
            </ItemContent>
        </Item>
    );
}