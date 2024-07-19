import db from "../models/index.cjs";
import axios from "axios";

//function to sign the DTEs
export const dteSign = async (dte) => {
    let result = null;
    try {

        //getting api signer info
        const api = await db.ApiCredential.findOne({ where: { code: 'MH_SIGNER' } });

        if (!api) {
            throw "No se encontró registro del firmador.";
        }
        
        const data = {
            "nit": api.user,
            "activo": true,
            "passwordPri": api.password,
            "dteJson": dte
        }

        const dataSigned = await axios.post(api.url.concat("/"), data, {
            headers: {
                "content-type": "application/json",
            }
        });

        result = dataSigned.data.body;
    } catch (error) {
        console.log(error);
        //trow error
        throw typeof error === 'string' ? error : 'Error al firmar el documento.';
    }

    return result;
}

// function to get the token from mh api
export const loginMHApi = async () => {
    let token = null;
    const actualTime = Date.now();

    try {
        //consulting token from ApiCredential model
        const api = await db.ApiCredential.findOne({ where: { code: 'MH_FE_API' } });
        if (!api) {
            throw "No se encontró registro de api del MH para FE.";
        }

        // if token is correct and is active, return it.
        if (api.token && api.tokenExpire > actualTime) {
            return api.token;
        }

        // getting new token
        const result = await axios.post(api.url.concat('/seguridad/auth/'), {
            user: api.user,
            pwd: api.password
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        //saving token
        token = result.data.body.token;

        //updating token in ApiCredential
        await api.update({ token, tokenExpire: actualTime + (23.5 * 3600000), response: JSON.stringify(result.data) });
    } catch (error) {
        console.log(error);
        throw typeof error == "string" ? error : "Error al iniciar sesión en el API de MH."
    }

    return token;
}