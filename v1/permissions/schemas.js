export default {
    create: {
        actions: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un arreglo de permisos'
            },
            isString: {
                errorMessage: 'Ingrese un arreglo de permisos'
            },
            isLength: {
                options: { max: 4, min: 1 },
                errorMessage: 'Los permisos son obligatorios'
            },
            custom: {
                options: (value) => {
                    const regex = /^[crud]+$/i; // expresión regular para verificar las letras CRUD (mayúsculas o minúsculas)
                    if (!regex.test(value)) {
                        throw new Error('El campo solo puede contener las letras C, R, U y D (mayúsculas o minúsculas)');
                    }
                    return true;
                }
            },
            trim: true // Sanitiza el campo
        },
        state: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un estado'
            },
            isInt: {
                options: { min: 0 },
                errorMessage: 'El estado debe ser un número entero positivo'
            }
        },
        roleId: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un id de rol'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del rol debe ser un número entero positivo'
            }
        },
        routeId: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un id de ruta'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id de la ruta debe ser un número entero positivo'
            }
        }
    },
    update: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del permiso debe ser un número entero positivo'
            }
        },
        actions: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un arreglo de permisos'
            },
            isString: {
                errorMessage: 'Ingrese un arreglo de permisos'
            },
            isLength: {
                options: { max: 4, min: 1 },
                errorMessage: 'Los permisos son obligatorios'
            },
            custom: {
                options: (value) => {
                    const regex = /^[crud]+$/i; // expresión regular para verificar las letras CRUD (mayúsculas o minúsculas)
                    if (!regex.test(value)) {
                        throw new Error('El campo solo puede contener las letras C, R, U y D (mayúsculas o minúsculas)');
                    }
                    return true;
                }
            },
            trim: true // Sanitiza el campo
        },
        state: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un estado'
            },
            isInt: {
                options: { min: 0 },
                errorMessage: 'El estado debe ser un número entero positivo'
            }
        },
        roleId: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un id de rol'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del rol debe ser un número entero positivo'
            }
        },
        routeId: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un id de ruta'
            },
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id de la ruta debe ser un número entero positivo'
            }
        }
    },
    changeState: {
        id: {
            in: ['params'],
            isInt: {
                options: { min: 1 },
                errorMessage: 'El id del permiso debe ser un número entero positivo'
            }
        },
        state: {
            in: ['body'],
            exists: {
                errorMessage: 'Ingrese un estado'
            },
            isInt: {
                options: { min: 0 },
                errorMessage: 'El estado debe ser un número entero positivo'
            }
        }
    }
};