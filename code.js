const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.static("public"));
app.use(express.json());

const con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"dipendra10",
	database:"shorturls"
});
con.connect(function(error){
	if(error){
		console.log("Database connection failed");
	}
})

app.get("/",function(request,response){
	response.sendFile(__dirname + "/public/index.html");
});

app.get("/api/get-all-short-urls/:id", (request, response) => {
	let sql = `SELECT * FROM links WHERE id=${request.params.id}`;
	con.query(sql, (error, results) => {
		if(error){
			response.status(500).json({
				status: "notok",
				message: "Something went wrong"
			})
		}else{
			response.status(200).json(results)
		}
	})
})

app.post('/api/get-all-short-urls/:id', (request, response) => {
	// console.log(request.body)
	// console.log(request.params.id)
	let sql = `UPDATE links SET longurl="${request.body.longurl}" WHERE id=${request.params.id}`
	con.query(sql, (error, result) => {
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			response.status(200).json({
				message: "Deleted"
			});
		}			
	})
})

app.post("/api/create-short-url",function(request,response){
	let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substr(2,10);
	let sql = `INSERT INTO links(longurl,shorturlid) VALUES('${request.body.longurl}','${uniqueID}')`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			response.status(200).json({
				status:"ok",
				shorturlid:uniqueID
			});
		}		
	})
});



app.get("/api/get-all-short-urls",function(request,response){
	let sql = `SELECT * FROM links`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			response.status(200).json(result);
		}
	})
});



app.delete('/api/get-all-short-urls/:id',(request, response) => {
  let sql = `DELETE FROM links WHERE id=${request.params.id}`;   
  con.query(sql, (error, results) => {
    if(error) throw error;
	    response.status(200).json({
				status:"ok",
				message:"Deleted"
			});;
  });
});

app.get("/:shorturlid",function(request,response){
	let shorturlid = request.params.shorturlid;
	let sql = `SELECT * FROM links WHERE shorturlid='${shorturlid}' LIMIT 1`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			sql = `UPDATE links SET count=${result[0].count+1} WHERE id='${result[0].id}' LIMIT 1`;
			con.query(sql,function(error,result2){
				if(error){
					response.status(500).json({
						status:"notok",
						message:"Something went wrong"
					});
				} else {
					response.redirect(result[0].longurl);
				}
			})
		}
	})
});

app.listen(5000);
