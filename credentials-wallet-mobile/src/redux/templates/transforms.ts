import { BaseTemplate, Template } from "@app/redux/templates/types";

export const transformBaseTemplate = (template: BaseTemplate): Template => {
    return {
        ...template,
        claims: template.claims.map((claim, index) => ({
                ...claim,
                claimed: false,
                id: index
            }))
    }
};