const validations = {
    body: {
        oldId: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un id de control'
            },
            isString: {
                errorMessage: 'El id de control debe ser una cadena de texto'
            },
            isLength: {
                options: { max: 50 },
                errorMessage: 'El id de control debe tener un máximo de 50 caracteres'
            },
            trim: true
        },
        documentNumber: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un documento'
            },
            isString: {
                errorMessage: 'El documento debe ser una cadena de texto'
            },
            isLength: {
                options: { max: 50 },
                errorMessage: 'El documento debe tener un máximo de 50 caracteres'
            },
            trim: true
        },
        name: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un nombre'
            },
            isString: {
                errorMessage: 'El nombre debe ser una cadena de texto'
            },
            isLength: {
                options: { max: 200 },
                errorMessage: 'El nombre debe tener un máximo de 200 caracteres'
            },
            trim: true
        },
        email: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un correo electrónico'
            },
            isEmail: {
                errorMessage: 'El correo electrónico no es válido'
            },
            normalizeEmail: true,
            trim: true
        },
        address: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese una dirección'
            },
            isString: {
                errorMessage: 'La dirección debe ser una cadena de texto'
            },
            isLength: {
                options: { max: 500 },
                errorMessage: 'La dirección debe tener un máximo de 500 caracteres'
            },
            trim: true
        },
        state: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un estado'
            },
            isInt: {
                options: { min: 0 },
                errorMessage: 'Ingrese un estado válido'
            }
        },
        documentTypeId: {
            in: ['body'],
            exists: {
                errorMessage: 'El tipo de documento es obligatorio'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'El valor del tipo de documento debe ser valido'
            }
        }
    },
    params: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id debe ser un número entero positivo'
            }
        },
    }
};

export default {
    create: validations.body,
    update: {
        ...validations.params,
        ...validations.body
    },
    delete: validations.params,
};