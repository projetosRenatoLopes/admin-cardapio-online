const replaceAccent = (str) =>{
    str = str.replace(/[ÀÁÂÃÄÅàáâãäå]/,"a");
    str = str.replace(/[ÈÉÊË]/,"E");
    str = str.replace(/[Çç]/,"c");
    str = str.replace(/[Íí]/,'i');

    return str.replace(/[^a-z0-9]/gi,''); 
}

export default replaceAccent;