export const schema = {
    firstName: {
      in: ['body'],
      isString: {
        errorMessage: 'El nombre debe ser una cadena de texto'
      },
      isLength: {
        options: { min: 1 },
        errorMessage: 'El nombre es obligatorio'
      },
      trim: true // Sanitiza el campo
    },
    lastName: {
      in: ['body'],
      isString: {
        errorMessage: 'El apellido debe ser una cadena de texto'
      },
      isLength: {
        options: { min: 1 },
        errorMessage: 'El apellido es obligatorio'
      },
      trim: true // Sanitiza el campo
    },
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: 'Debe ingresar un correo electrónico válido'
      }
    },
    password: {
      in: ['body'],
      isString: {
        errorMessage: 'La contraseña debe ser una cadena de texto'
      },
      isLength: {
        options: { min: 6 },
        errorMessage: 'La contraseña es obligatoria'
      }
    },
    state: {
      in: ['body'],
      isInt: {
        options: { min: 0 },
        errorMessage: 'El estado debe ser un número entero positivo'
      }
    },
    roleId: {
      in: ['body'],
      isInt: {
        options: { min: 1 },
        errorMessage: 'El ID del del rol debe ser un número entero positivo'
      }
    }
};