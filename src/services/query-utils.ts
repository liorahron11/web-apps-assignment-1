

import mongoose from 'mongoose';


export const isIdValid = (id: string): boolean => {
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) return true;
    
    return false;
}