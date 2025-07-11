export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const initial=(title)=>{
  if(!title) return "";
  const word=title.split(" ");
  let initials="";
  for(let i=0;i<Math.min(word.length,2);i++){
    initials+=word[i][0];
  }
  return initials.toUpperCase();
}