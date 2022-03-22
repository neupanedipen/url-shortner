const host = "http://localhost:5000/";
		document.querySelector("#create-short-url").addEventListener("click",function(){
			let longurl = document.querySelector("#longurl").value.trim();
			if(longurl.length == 0){
				alert("Enter valid url");
				return;
			} else if(!(longurl.startsWith("http://") || longurl.startsWith("https://"))){
				alert("Enter valid link");
				return;
			}
			fetch(host+"api/create-short-url",{
				method:"POST",
				body:JSON.stringify({
					longurl:longurl
				}),
				headers:{
					"Content-type":"application/json; charset=UTF-8"
				}
			}).then(function(response){
				return response.json();
			}).then(function(data){
				if(data.status == "ok"){
					document.querySelector("#short-url").innerText = host + data.shorturlid;
					document.querySelector("#short-url").href = host + data.shorturlid;
					let html = `
						<tr>
							<td>${longurl}</td>
							<td>${host}${data.shorturlid}</td>
							<td>${0}</td>
							<td id="deleteBtn"><span id="edit">Edit</span>  <span id="delete">X</span></td>

						</tr>
					`;
					document.querySelector("#list_urls tbody").innerHTML += html;

				}
			}).catch(function(error){
				alert("Something went wrong");
			})
		});
		(function(){
			fetch(host+"api/get-all-short-urls").then(function(response){
				return response.json();
			}).then(function(data){
				let dataId;
				let html = "";

				data.forEach(d => {
					dataId = d.id;
					html+= `
						<tr>
							<td>${d.longurl}</td>
							<td>${host}${d.shorturlid}</td>
							<td>${d.count}</td>
							<td id="deleteBtn"><span id="edit">Edit</span>  <span id="delete">X</span></td>
						</tr>
					`;
				})
				// for(let i=0;i<data.length;i++){
				// 	dataId = data[i].id;
				// 	html += `
				// 		<tr>
				// 			<td>${data[i].longurl}</td>
				// 			<td>${host}${data[i].shorturlid}</td>
				// 			<td>${data[i].count}</td>
				// 			<td id="deleteBtn"><span id="edit">Edit</span>  <span id="delete">X</span></td>
				// 		</tr>
				// 	`;
				// }
				document.querySelector("#list_urls tbody").innerHTML = html;
				document.querySelector("#deleteBtn #delete").addEventListener('click', () => {
					//copied code 
					fetch(host+"api/get-all-short-urls/"+dataId,{
						method:"DELETE",
						headers:{
							"Content-type":"application/json; charset=UTF-8"
						}
					}).then(function(response){
						location.href = "/"
						console.log(response)
						// console.log(response);
					}).catch(function(error){
						alert("Something went wrong");
					})

			//copied code end
				})

				document.querySelector("#deleteBtn #edit").addEventListener("click", () => {
					console.log(dataId)
					fetch(host+"api/get-all-short-urls/"+dataId,{
						method:"GET",
						headers:{
							"Content-type":"application/json; charset=UTF-8"
						}
					}).then(response => response.json()).then(data => {
						let addCon = ""
						for(let i=0;i<data.length;i++){
							addCon += `
								<div class="form">
									<h2>EDIT URL</h2>
									<div class="form-element">
										<label for="longurl">Link</label>
										<input type="text" id="updatedURL" placeholder="http://site.com" value=${data[0].longurl}>
									</div>
									<div class="form-element">
										<button id="update-url">Update URL</button>
									</div>
								</div>
							`;
						}	

						document.querySelector("#editForm ").innerHTML = addCon;
						document.querySelector("#update-url").addEventListener('click', () =>{
							let longurl = document.querySelector("#updatedURL").value.trim();
								if(longurl.length == 0){
									alert("Enter valid url");
									return;
								} else if(!(longurl.startsWith("http://") || longurl.startsWith("https://"))){
									alert("Enter valid link");
									return;
								}
							// console.log("clicked")
							fetch(host+"api/get-all-short-urls/"+dataId,{
								method:"POST",
								body:JSON.stringify({
									longurl:longurl
								}),
								headers:{
									"Content-type":"application/json; charset=UTF-8"
								}
							}).then(function(response){
								location.href = "/"
							}).catch(error => console.log(error))							
						})
					}).catch(function(error){
						alert("Something went wrong");
					})					
				})

			}).catch(function(error){
				console.log(error)
				// alert("Something went wrong here");
			})
		})();
