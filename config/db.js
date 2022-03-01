if(process.env.NODE_ENV == "production"){
      module.exports = {uri: MONGODB_URI}
      console.log("dbmlab")
}else{
      console.log("dblocal")
      module.exports = {uri: "mongodb://localhost/blogapp2"}
      //module.exports = {mongoURI: "mongodb://localhost/blogapp2"}
}
