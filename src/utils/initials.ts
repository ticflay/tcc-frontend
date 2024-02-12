export const getNameInitiials = (name: string) => {
let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

console.log('name', name)
let initials = [...name.matchAll(rgx)] || [];

const finalInititials = (
  (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
).toUpperCase();
return finalInititials;
}