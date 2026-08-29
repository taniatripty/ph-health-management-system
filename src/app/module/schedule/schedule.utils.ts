export const convertionDateTime= async(date: Date) => {
    const offset= date.getTimezoneOffset() *60000;
    return new Date(date.getTime() + offset);

}

// export const convertionDateTime = (date: Date): Date => {
//   const offset = date.getTimezoneOffset() * 60000;

//   return new Date(date.getTime() + offset);
// };