import db from '../models/index.cjs';

export const getCorrelativeForCodeMH = async (codeMH) => {
    return await db.Correlative.findOne({
        where: { codeMH, state: 1 }
    });
};

export const incrementCorrelative = async (codeMH) => {
    await db.Correlative.increment('actual', { by: 1, where: { codeMH, state: 1 } });
};