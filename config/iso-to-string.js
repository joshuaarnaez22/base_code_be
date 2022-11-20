


module.exports.isoToString =  function (date = new Date()) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return  date.toLocaleString('en-US', options);
}
   
  /*  

const isoStr1 = '2022-11-12T15:11:55.000Z';

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const date = new Date(isoStr1);
console.log(date.toLocaleString('en-US', options));


*/