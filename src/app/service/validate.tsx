function validateFileName(fileName: string,includesLength:boolean): string | null {
    fileName=fileName.trim()
    if (fileName.length==0) {
      return "File name cannot be empty.";
    }

    if(includesLength){
        if (fileName.length > 240) {
            return `File name exceeds the maximum allowed length of ${240} characters.`;
        }
    }
    
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
    if (invalidChars.test(fileName)) {
      return "File name contains invalid characters.";
    }
    return null;
}

function containsHtmlTags(input: string):boolean{
    const regex = /<[^>]*>?/gm;
    return regex.test(input);
};

function validateUsername(username: string,includesLength:boolean): string | null {

    username=username.trim()
    if(username.length==0){
        return 'Username cannot be empty.';
    }
    if (containsHtmlTags(username)) {
        return 'HTML tags are not permitted in the username.';
        
    }
    if (!/^[a-zA-Z]+$/.test(username)) {
        return 'Username should only contain alphabets.';
    }
    if(includesLength){
        if (username.length > 10) {
            return 'Username should not exceed 10 characters.';
         } 
         if (username.length < 4) {
             return'Username should be at least 4 characters long.';
         }
    }
    
    return null; 

}

function validatePassword(password: string,includesLength:boolean): string | null {
    
    password=password.trim()
    if (password.length === 0) {
      return 'Password cannot be empty.';
    }
    if(includesLength){
        if (password.length > 10) {
            return 'Password should not exceed 10 characters.';
        }
        if (password.length < 6) {
            return 'Password should be at least 6 characters long.';
        }
    }
    
    return null;
  }



export {validateFileName,validateUsername, validatePassword}