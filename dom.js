var url = 'https://crudcrud.com/api/475aeb8cc60f496ea86968bd553abd00';

function addItem(){
    var name = document.getElementById("name").value;
    var des = document.getElementById("des").value;

    let obj = {
      name,
      des
    };

    axios.post(`${url}/todoRem`,obj)
        .then(respond => showNewUserOnScreen(respond.data, "todoRem"))
        .catch(err => console.log(err));

}

window.addEventListener("DOMContentLoaded", () => {
    axios.get(`${url}/todoRem`)
        .then((respond) => {

            for(var i=0;i<respond.data.length;i++){
                showNewUserOnScreen(respond.data[i],"todoRem");
            }
        })
        .catch(err => console.log(err));

    axios.get(`${url}/todoDone`)
        .then((respond) => {

            for(var i=0;i<respond.data.length;i++){
                showNewUserOnScreen(respond.data[i],"todoDone");
            }
        })
        .catch(err => console.log(err));

    });
    


function deleteTask(e){
    if(confirm('Are You Sure?')){
        var li = e.target.parentElement;
        var liContent = li.innerText;
        const str = liContent.split(":");
        var name = str[0].trim();
        var list = li.parentElement;
        var id = list.getAttribute('id');


        var baseUrl =`${url}/todoDone`;

        if(id==='todoRem')
            baseUrl = `${url}/todoRem`;
        

        deletePromise(name, baseUrl)
        .then((response) => {
            var list = document.getElementById(id);
            list.removeChild(li);
        })
        .catch(errorMessage => {
            console.log(errorMessage);
        });
    }
}

function deletePromise(name, baseUrl) {
    return new Promise((resolve, reject) => {
        
        axios.get(baseUrl, {
            params: {name}
        })
        .then(response => {
            const foundUser = response.data[0];

            if (foundUser) {
                
                const userIdToDelete = foundUser._id;

                axios.delete(`${baseUrl}/${userIdToDelete}`)
                    .then(deleteResponse => {
                        resolve(deleteResponse);
                    })
                    .catch(deleteError => {
                        reject(`Error deleting user: ${deleteError}`);
                    });
            } else {
                reject(`task not found`);
            }
        })
        .catch(error => {
            reject(`Error searching for task: ${error}`);
        });
    });
}

function showNewUserOnScreen(obj, sec){

    var name = obj.name;
    var des = obj.des;
        
    var val = name+' : '+des;

    if(sec==="todoRem"){
        var list = document.getElementById('todoRem');
        
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(val));
            
        var doneBtn = document.createElement('button');
        doneBtn.onclick = doneTask;
        doneBtn.appendChild(document.createTextNode('✓'));
        doneBtn.className = 'btn btn-primary';
        doneBtn.style.color = 'white';
        doneBtn.style.background = 'green';
        doneBtn.style.marginLeft='7px';
        li.appendChild(doneBtn);
                    
        var deleteBtn = document.createElement('button');
        deleteBtn.onclick = deleteTask;
        deleteBtn.appendChild(document.createTextNode('𐤕'));
        deleteBtn.className = 'btn btn-primary';
        deleteBtn.style.color = 'white';
        deleteBtn.style.background = 'red';
        deleteBtn.style.marginLeft='7px';
        li.appendChild(deleteBtn);
            
        li.style.padding = '5px';
        list.appendChild(li);
    }

    else if(sec==="todoDone"){
        var list = document.getElementById('todoDone');
        
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(val));
                    
        var deleteBtn = document.createElement('button');
        deleteBtn.onclick = deleteTask;
        deleteBtn.appendChild(document.createTextNode('𐤕'));
        deleteBtn.style.color = 'white';
        deleteBtn.className = 'btn btn-primary';
        deleteBtn.style.background = 'red';
        deleteBtn.style.marginLeft='7px';
        li.appendChild(deleteBtn);
            
        li.style.padding = '5px';
        list.appendChild(li);
    }
                
    

}


function doneTask(e){
    var li = e.target.parentElement;
    var liContent = li.innerText;
    const str = liContent.split(":");
    var name = str[0].trim();
    var list = li.parentElement;
    var id = list.getAttribute('id');

    var baseUrl = `${url}/todoRem`;
    deletePromise(name, baseUrl)
        .then((response) => {

            var list = document.getElementById('todoRem');
            list.removeChild(li);

            var obj = {
                'name': str[0].trim(),
                'des': str[1].replace("✓𐤕","")
            }

        axios.post(`${url}/todoDone`,obj)
            .then(respond => showNewUserOnScreen(respond.data,"todoDone"))
            .catch(err => console.log(err));

        })
        .catch(errorMessage => {
            console.log(errorMessage);
        });


}