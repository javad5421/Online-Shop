export default function errorHandler (err, req, res, next) {
    if(err){
        console.log(err.stack);
        res.status(500).send("something went wrong");
    }
}