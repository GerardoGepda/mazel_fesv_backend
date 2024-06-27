const validations = {
    body: {
        name: {
            in: ['body'],
            exists: {
                errorMessage: 'Se debe ingresar un nomnbre de menú'
            },
            isString: {
                errorMessage: 'Se debe ingresar un nomnbre de menú valido'
            },
            isLength: {
                options: { max: 50, min: 1 },
                errorMessage: 'El nombre del menú debe tener entre 1 y 50 caracteres'
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
                errorMessage: 'Ingrese un orden para el menú'
            },
            isInt: {
                errorMessage: 'Ingrese un orden valido'
            }
        },
        icon: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un icono para el menú'
            },
            isString: {
                errorMessage: 'Se debe ingresar un icono de menú valido'
            },
            isLength: {
                options: { max: 50, min: 1 },
                errorMessage: 'El icono del menú debe tener entre 1 y 50 caracteres'
            },
            trim: true
        },
        routeId: {
            in: ['body'],
            exists: {
                errorMessage: 'Seleccione una ruta'
            },
            custom: {
                options: (value) => {
                    if (value === null) {
                        return true;
                    }
                    if (!Number.isInteger(value)) {
                        throw new Error('Ingrese una ruta válida');
                    }
                    return true;
                }
            }
        },
        hasSubmenus: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese si el menú tiene submenús'
            },
            isBoolean: {
                errorMessage: 'Ingrese un valor correcto para submenús'
            }
        },
    },
    params: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del menú debe ser un número entero positivo'
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
    },
    modifyOrders: {
        source: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese la fuente del menú'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'Ingrese una fuente válida'
            }
        },
        destination: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese el destino del menú'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'Ingrese un destino válido'
            }
        }
    },
    menusByRoleId: {
        roleId: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del rol debe ser un número entero positivo'
            }
        }
    }
};