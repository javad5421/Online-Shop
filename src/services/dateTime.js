function dateTime(){
    const dt = new Date();
    //current year
    const year = dt.getFullYear();

    //mounth
    const mounth = ("+" + (dt.getMonth() +1)).slice(-2);

    //day
    const day = ("0" + dt.getDate).slice(-2);
    //hour
    const hour = dt.getHours();

    //minutes
    const minutes = dt.getMinutes();

    //seconds 
    const seconds = dt.getSeconds();

    const output = year+mounth+day+hour+minutes+seconds;
    return output;
}

export {dateTime};
