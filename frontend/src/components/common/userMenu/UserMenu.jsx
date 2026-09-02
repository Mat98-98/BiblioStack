import UserAccountMenu from "@/components/common/userMenu/UserAccountMenu.jsx";
import UserAccountSheet from "@/components/common/userMenu/UserAccountSheet.jsx";

/*
    Menu utente responsive: dropdown da dimensioni maggiori a sm

    dropdownSide configurabile con ["top"|"right"|"bottom"|"left"]
    sheetSide configurabile con ["top"|"right"|"bottom"|"left"]
    dropdownAlign configurabile con ["start"|"center"|"end"]
 */

export default function UserMenu({
                                     trigger,
                                     mobileTrigger,
                                     dropdownSide = "bottom",
                                     dropdownAlign = "end",
                                     sheetSide = "right"
}) {
    return (
        <>
            <div className="hidden sm:block">
                <UserAccountMenu trigger={trigger} side={dropdownSide} align={dropdownAlign} />
            </div>

            <div className="sm:hidden">
                <UserAccountSheet trigger={mobileTrigger ?? trigger} side={sheetSide} />
            </div>
        </>
    )
}