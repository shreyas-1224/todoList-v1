
module.exports= getDate;

function getDate(){
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    const day = today.toLocaleDateString("en-US", options);
    return day;
}