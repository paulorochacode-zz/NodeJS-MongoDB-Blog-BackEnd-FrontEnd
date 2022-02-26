if(process.env.NODE_ENV == "production"){
      module.exports = {uri: "mongodb+srv://paulorochadb:aIZ6nQKhTvyAKmre@cluster0.ua3n6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
      console.log("dbmlab")
}else{
      console.log("dblocal")
      module.exports = {uri: "mongodb+srv://paulorochadb:aIZ6nQKhTvyAKmre@cluster0.ua3n6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
      //module.exports = {mongoURI: "mongodb://localhost/blogapp2"}
}
