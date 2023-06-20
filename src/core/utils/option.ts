import { MenuOption, SelectOption } from "../../app/viewModel/viewData";

function remapToSelectOption(value: any, label: string): SelectOption {
    return {
        value,
        label,
    }
}

function remapToMenuOption(key: string, label: string): MenuOption {
    return {
        key,
        label,
    }
}

export {
    remapToSelectOption,
    remapToMenuOption,
}