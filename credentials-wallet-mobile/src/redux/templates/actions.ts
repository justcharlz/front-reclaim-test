import { updateLink } from "@app/redux/links";
import { Link } from "@app/redux/links/types";
import { typedCreateAsyncThunk } from "@app/redux/extraConfig";

export const handleSubmitTemplateLink = typedCreateAsyncThunk<
    void,
    { link: Link }
>(
    'templates/submitTemplateLinkStatus',
    async ({ link }, { dispatch, getState }) => {
        try{
            const payload =  {
                claims: link.claims.map(claim => {                        
                    return {
                        id: claim.id,
                        provider: claim.provider,
                        redactedParameters: claim.redactedParameters,
                        ownerPublicKey: claim.ownerPublicKey,
                        timestampS: claim.timestampS,
                        witnessAddresses: claim.witnessAddresses,
                        signatures: claim.signatures
                    }
                }),
            };
          
            if(!link.template) throw Error('Template not found');
            await fetch(link.template.callbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const updatedLink: Link = {
                ...link,
                isSubmitted: true,
            };

            dispatch(updateLink(updatedLink));
        }
        catch(e){
            console.log(e);
        }
    }
);