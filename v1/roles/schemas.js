export default {
    getRolePermissions: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del rol debe ser un número entero positivo'
            }
        }
    },
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
                errorMessage: 'El id del rol debe ser un número entero positivo'
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
                errorMessage: 'El id del rol debe ser un número entero positivo'
            }
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