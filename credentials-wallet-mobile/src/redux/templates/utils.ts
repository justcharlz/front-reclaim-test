import { BaseTemplate, Template, TemplateClaim, BaseTemplateClaim } from "@app/redux/templates/types"

export const isBaseTemplateClaim = (obj: any): obj is BaseTemplateClaim => {
    return (obj as TemplateClaim).provider !== undefined
        && (obj as TemplateClaim).params !== undefined
}

export const isTemplateClaim = (obj: any): obj is TemplateClaim => {
    return isBaseTemplateClaim(obj) && (obj as TemplateClaim).id !== undefined;
}

export const isBaseTemplate = (obj: any): obj is BaseTemplate => {
    return (obj as Template).id !== undefined
        && (obj as Template).name !== undefined
        && (obj as Template).firebaseToken !== undefined
        && (obj as Template).walletAddress !== undefined
        && (obj as Template).claims !== undefined
        && (obj as Template).claims.every(isBaseTemplateClaim)
}