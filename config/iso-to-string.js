


module.exports.isoToString =  function (date = new Date()) {
      let options = {
        year: "numeric",
        month: "long",
        day: "2-digit",
    }
      day =  new Intl.DateTimeFormat("en-US", options).format(date).toString();
      return day.replace(',', '');
}
