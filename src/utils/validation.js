class ValidationUtils{
    static isEmpty(val){
        if(val == null || val == undefined) return true;
        if(typeof val === 'string' && val.trim() === '') return true;
        if(typeof val === 'object' && Object.keys(val).length === 0) return true;
        return false;
    }
}

export default ValidationUtils;
