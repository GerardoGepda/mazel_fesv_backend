export default {
    create: {
        name: {
            in: ['body'],
            isString: {
                errorMessage: 'El nombre debe ser una cadena de texto'
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'El nombre es obligatorio'
            },
            trim: true // Sanitiza el campo
        },
        path: {
            in: ['body'],
            isString: {
                errorMessage: 'La ruta debe ser una cadena de texto'
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'La ruta es obligatoria'
            },
            trim: true // Sanitiza el campo
        },
        state: {
            in: ['body'],
            isInt: {
                options: { min: 0 },
                errorMessage: 'El estado debe ser un número entero positivo'
            }
        }
    },
    changeState: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id de la ruta debe ser un número entero positivo'
            }
        },
        state: {
            in: ['body'],
            isInt: {
                options: { min: 0 },
                errorMessage: 'El estado debe ser un número entero positivo'
            }
        }
    },
    update: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id de la ruta debe ser un número entero positivo'
            }
        },
        name: {
            in: ['body'],
            isString: {
                errorMessage: 'El nombre debe ser una cadena de texto'
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'El nombre es obligatorio'
            },
            trim: true // Sanitiza el campo
        },
        path: {
            in: ['body'],
            isString: {
                errorMessage: 'La ruta debe ser una cadena de texto'
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'La ruta es obligatoria'
            },
            trim: true // Sanitiza el campo
        },
        state: {
            in: ['body'],
            isInt: {
                options: { min: 0 },
                errorMessage: 'El estado debe ser un número entero positivo'
            }
        }
    }
};