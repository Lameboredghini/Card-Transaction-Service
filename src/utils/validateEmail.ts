import Joi from 'joi';
import CustomError from './customError';
function validateEmail(email: string): void {
  const schema = Joi.string().required().email().messages({
    'any.required': `"email" is required. Enter a valid email!`,
    'string.email': `"email" is invalid. Enter a valid email!`,
    'string.empty': `"email" is required`,
    'string.base': `"email" is invalid. Enter a valid email!`,
  });

  const { error } = schema.validate(email);

  if (error) throw new CustomError('ValidationError', error.details[0].message, {});
}

export default validateEmail;
