import { ProviderType } from "@app/providers"

export interface BaseTemplateClaim  {
    provider: ProviderType
    params: { [key: string]: string }
}

export interface TemplateClaim extends BaseTemplateClaim {
    id: number
}

export interface BaseTemplate {
    id: string
    name: string
    firebaseToken: string
    publicKey: string
    claims: BaseTemplateClaim[]
    callbackUrl: string
}

export interface Template extends BaseTemplate{
    claims: TemplateClaim[]
}