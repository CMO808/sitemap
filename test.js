let a = "           ";
let b = 1;
const blank_pattern = /^\s+|\s+$/g;
console.log(!a.replace(blank_pattern, ''))
console.log(!b)
if(a){
  console.log("first")
}