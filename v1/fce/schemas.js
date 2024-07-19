const validations = {
    body: { },
    params: {
        initialDate: {
            in: ['params'],
            isDate: {
                errorMessage: 'La fecha no es válida',
                options: { format: 'YYYY-MM-DD', delimiters: ['-', '/'] }
            },
            //toDate: true,  // Convierte el valor en un objeto Date
        },
        finalDate: {
            in: ['params'],
            isDate: {
                errorMessage: 'La fecha no es válida',
                options: { format: 'YYYY-MM-DD', delimiters: ['-', '/'] }
            },
            //toDate: true,  // Convierte el valor en un objeto Date
        },
        emissionDate: {
            in: ['params'],
            isDate: {
                errorMessage: 'La fecha no es válida',
                options: { format: 'YYYY-MM-DD', delimiters: ['-', '/'] }
            },
            //toDate: true,  // Convierte el valor en un objeto Date
        },
    }
};

export default {
    getOdbc: validations.params
};