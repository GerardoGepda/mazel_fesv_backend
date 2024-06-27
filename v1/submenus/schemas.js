const validations = {
    body: {
        name: {
            in: ['body'],
            exists: {
                errorMessage: 'Se debe ingresar un nomnbre de submenú'
            },
            isString: {
                errorMessage: 'Se debe ingresar un nomnbre de submenú valido'
            },
            isLength: {
                options: { max: 50, min: 1 },
                errorMessage: 'El nombre del submenú debe tener entre 1 y 50 caracteres'
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
                errorMessage: 'Ingrese un estado valido'
            }
        },
        order: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un orden para el submenú'
            },
            isInt: {
                errorMessage: 'Ingrese un orden valido'
            }
        },
        icon: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un icono para el submenú'
            },
            isString: {
                errorMessage: 'Se debe ingresar un icono de submenú valido'
            },
            isLength: {
                options: { max: 50, min: 1 },
                errorMessage: 'El icono del submenú debe tener entre 1 y 50 caracteres'
            },
            trim: true
        },
        menuId: {
            in: ['body'],
            exists: {
                errorMessage: 'Seleccione un menú'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'Debe seleccionar un menú válido'
            }
        },
        routeId: {
            in: ['body'],
            exists: {
                errorMessage: 'Seleccione una ruta'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'Debe seleccionar una ruta válida'
            }
        }
    },
    params: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del submenú debe ser un número entero positivo'
            }
        },
    }
};

export default {
    create: {
        ...validations.body
    },
    update: {
        ...validations.params,
        ...validations.body,
    },
    delete: {
        id: validations.params.id
    }
};